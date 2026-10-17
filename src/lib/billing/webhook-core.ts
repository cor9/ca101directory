import { ATTRIBUTION_WINDOW_DAYS } from "@/config/commission";
import { computeCommission, resolveAttribution } from "@/lib/commission";
import type { SupabaseFilterBuilder } from "@/lib/listings/update-listing-core";

/**
 * Loose shape covering the chainable methods this module's functions
 * actually call. See update-listing-core.ts for why this is typed
 * loosely rather than against @supabase/supabase-js directly.
 */
export interface WebhookSupabaseClient {
  from(table: string): {
    select(cols?: string): SupabaseFilterBuilder;
    update(payload: Record<string, unknown>): SupabaseFilterBuilder;
    insert(payload: Record<string, unknown>): SupabaseFilterBuilder;
  };
}

/**
 * Terminal, non-paying Stripe subscription statuses. "past_due" is
 * deliberately excluded: Stripe is still retrying the payment and the
 * subscriber's current entitlement period hasn't ended, so Pro access
 * must not be pulled yet (Task 2: "A cancellation request should not
 * automatically remove paid benefits before the subscription's actual
 * entitlement period ends"). A cancel-at-period-end request keeps
 * status "active" (with cancel_at_period_end: true) until the period
 * actually ends, at which point Stripe sends
 * customer.subscription.deleted — handled by isSubscriptionTerminal
 * always treating that event as terminal regardless of status.
 */
const TERMINAL_SUBSCRIPTION_STATUSES: ReadonlySet<string> = new Set([
  "canceled",
  "unpaid",
  "incomplete_expired",
]);

export function isTerminalSubscriptionStatus(status: string): boolean {
  return TERMINAL_SUBSCRIPTION_STATUSES.has(status);
}

export type ProFulfillmentParams = {
  listingId: string;
  vendorId: string | undefined;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
};

export type ProFulfillmentResult =
  | { outcome: "fulfilled" }
  | { outcome: "ownership_conflict"; existingOwnerId: string }
  | { outcome: "error"; message: string };

/**
 * Grants Pro on exactly the listing checkout metadata named — never the
 * payer's account broadly. This is how a vendor who owns two listings
 * and upgrades one gets only that one upgraded: listingId comes from
 * the Checkout Session's own metadata.listing_id/client_reference_id,
 * set once at session-creation time in
 * /api/create-checkout-session, specific to a single listing. The other
 * listing that vendor owns is never touched by this call because its id
 * never appears here.
 *
 * Idempotent by construction: every field it sets (plan, owner_id,
 * is_claimed, stripe_subscription_id, ...) is an absolute SET, not an
 * increment/append, so replaying the same checkout.session.completed
 * event (a Stripe retry) any number of times converges to the same
 * state rather than compounding. Records stripeSubscriptionId
 * (non-fatally — see the missing-column note in its own branch) so a
 * later customer.subscription.deleted/updated event, which carries a
 * subscription id but no listing id, can find its way back to this
 * exact listing via performSubscriptionDowngrade below.
 */
export async function performProFulfillment(
  supabase: WebhookSupabaseClient,
  params: ProFulfillmentParams,
): Promise<ProFulfillmentResult> {
  const { data: listing } = await supabase
    .from("listings")
    .select("owner_id")
    .eq("id", params.listingId)
    .single();

  const existingOwnerId = listing?.owner_id ?? null;

  if (
    params.vendorId &&
    existingOwnerId &&
    existingOwnerId !== params.vendorId
  ) {
    // Genuine data-identity conflict: this listing already belongs to a
    // different account than the one that paid. Never reassign
    // ownership or flip plan automatically here.
    return { outcome: "ownership_conflict", existingOwnerId };
  }

  const fulfillmentUpdate: Record<string, unknown> = {
    plan: "Pro",
    updated_at: new Date().toISOString(),
  };
  if (params.vendorId) {
    fulfillmentUpdate.owner_id = params.vendorId;
    fulfillmentUpdate.is_claimed = true;
    fulfillmentUpdate.pending_claim_email = null;
    fulfillmentUpdate.stripe_session_id = null;
  }

  const { error: fulfillError } = await supabase
    .from("listings")
    .update(fulfillmentUpdate)
    .eq("id", params.listingId)
    .select()
    .single();

  if (fulfillError) {
    return { outcome: "error", message: fulfillError.message };
  }

  if (params.vendorId) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        subscription_plan: "Pro",
        stripe_customer_id: params.stripeCustomerId,
      })
      .eq("id", params.vendorId)
      .select()
      .single();

    if (profileError) {
      return { outcome: "error", message: profileError.message };
    }
  }

  // Isolated from the fulfillment update above and never treated as
  // fatal: supabase/migrations/20261017_add_stripe_subscription_tracking.sql
  // may not be applied yet, and a missing column here must never block
  // granting Pro access itself.
  if (params.stripeSubscriptionId) {
    await supabase
      .from("listings")
      .update({ stripe_subscription_id: params.stripeSubscriptionId })
      .eq("id", params.listingId)
      .select()
      .single();
  }

  return { outcome: "fulfilled" };
}

export type SubscriptionDowngradeResult = {
  listingsDowngraded: string[];
  listingsSkippedAsComped: string[];
  migrationApplied: boolean;
};

/**
 * Downgrades every listing whose stripe_subscription_id matches, and
 * the owning profile if it's still linked to that listing. This is the
 * other half of the subscription-to-listing association: a
 * customer.subscription.deleted/updated event carries only a
 * subscription id, so this is the only way to map back to the specific
 * listing(s) it funds. If a vendor has two Pro listings funded by two
 * separate subscriptions (each upgrade creates its own new Stripe
 * subscription — Checkout in subscription mode never reuses an existing
 * one), canceling one subscription here only matches the one listing
 * whose stripe_subscription_id equals it; the vendor's other listing,
 * tracking a different subscription id, is untouched.
 *
 * No-ops (migrationApplied: false) rather than throwing if the tracking
 * column hasn't been migrated in yet — there's nothing a Stripe retry
 * of this event would fix in that case.
 */
export async function performSubscriptionDowngrade(
  supabase: WebhookSupabaseClient,
  stripeSubscriptionId: string,
): Promise<SubscriptionDowngradeResult> {
  const { data: listings, error: lookupError } = await supabase
    .from("listings")
    .select("id, owner_id, comped")
    .eq("stripe_subscription_id", stripeSubscriptionId);

  if (lookupError) {
    return {
      listingsDowngraded: [],
      listingsSkippedAsComped: [],
      migrationApplied: false,
    };
  }

  const listingsDowngraded: string[] = [];
  const listingsSkippedAsComped: string[] = [];

  for (const listing of (listings ?? []) as Array<{
    id: string;
    owner_id: string | null;
    comped: boolean | null;
  }>) {
    if (listing.comped) {
      listingsSkippedAsComped.push(listing.id);
      continue;
    }

    await supabase
      .from("listings")
      .update({
        plan: "Free",
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listing.id)
      .select()
      .single();
    listingsDowngraded.push(listing.id);

    if (listing.owner_id) {
      await supabase
        .from("profiles")
        .update({ subscription_plan: "Free" })
        .eq("id", listing.owner_id)
        .select()
        .single();
    }
  }

  return {
    listingsDowngraded,
    listingsSkippedAsComped,
    migrationApplied: true,
  };
}

export type CommissionAttributionParams = {
  listingId: string;
  plan: string;
  comped: boolean;
  activeAssignment: { repId: string; assignedAt: Date } | null;
  repCode: string | undefined;
  repCodeLookup: { repId: string; active: boolean } | null;
  saleAmountCents: number;
  stripeEventId: string;
  stripeSessionId: string;
  stripeSubscriptionId: string | null;
  now: Date;
};

export type CommissionAttributionResult =
  | { recorded: true }
  | { recorded: false; reason: string }
  | { recorded: false; duplicate: true };

/**
 * Commission insert, deduplicated by the live rep_commissions.
 * stripe_event_id UNIQUE constraint (verified directly against the
 * production schema during this audit, not merely assumed from the
 * code's own comment) — a Stripe retry of the same event hits a 23505
 * unique-violation and is treated as "already recorded", not an error.
 */
export async function recordCommissionAttribution(
  supabase: WebhookSupabaseClient,
  params: CommissionAttributionParams,
): Promise<CommissionAttributionResult> {
  const attribution = resolveAttribution({
    plan: params.plan,
    comped: params.comped,
    isAdminInitiated: false,
    activeAssignment: params.activeAssignment,
    attributionWindowDays: ATTRIBUTION_WINDOW_DAYS,
    now: params.now,
    repCode: params.repCode,
    repCodeLookup: params.repCodeLookup,
  });

  if (attribution.attributed === false) {
    return { recorded: false, reason: attribution.reason };
  }

  const commission = computeCommission(params.plan, params.saleAmountCents);
  if (!commission) {
    return { recorded: false, reason: "plan not commissionable" };
  }

  const { error } = await supabase.from("rep_commissions").insert({
    rep_id: attribution.repId,
    listing_id: params.listingId,
    stripe_event_id: params.stripeEventId,
    stripe_session_id: params.stripeSessionId,
    stripe_subscription_id: params.stripeSubscriptionId,
    plan: params.plan,
    sale_type: "new_sale",
    sale_amount_cents: params.saleAmountCents,
    tier_rate: commission.tierRate,
    amount_cents: commission.amountCents,
    kind: "commission",
    status: "pending",
    attribution_source: attribution.source,
    attribution_note: attribution.note || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { recorded: false, duplicate: true };
    }
    return { recorded: false, reason: error.message };
  }

  return { recorded: true };
}
