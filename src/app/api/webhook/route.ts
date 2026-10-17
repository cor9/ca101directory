import { ATTRIBUTION_WINDOW_DAYS } from "@/config/commission";
import {
  computeCommission,
  computeRefundAdjustment,
  resolveAttribution,
} from "@/lib/commission";
import { createServerClient } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

// Reuses the existing Stripe webhook signing secret already configured for
// this endpoint (https://directory.childactor101.com/api/webhook) in the
// Stripe Dashboard. Do not introduce a second endpoint/secret.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Canonical Stripe webhook for this endpoint. Handles:
 * - checkout.session.completed: Pro fulfillment (plan flip, ownership/claim
 *   completion, profile update) followed by commission attribution.
 *   Accepts payment_status "paid" or "no_payment_required" (a 100%-off
 *   promo code checkout).
 * - customer.subscription.deleted: the subscription's final end (always
 *   terminal) — downgrades every listing it funded back to Free.
 * - customer.subscription.updated: downgrades on a move into a terminal,
 *   non-paying status (canceled/unpaid/incomplete_expired) only.
 *   cancel_at_period_end and payment-retry states (past_due) are
 *   deliberately left alone so Pro access survives until the paid
 *   period actually ends — see TERMINAL_SUBSCRIPTION_STATUSES.
 * - charge.refunded: commission clawback/adjustment.
 *
 * Fulfillment restores the server-side checkout-completion logic that used
 * to live at this URL (deleted in commit 688e3f16, never restored) — this
 * is the source of truth for granting Pro access now; payment-success is
 * UX confirmation only.
 *
 * NOTE: Stripe only sends event types this endpoint is subscribed to in
 * the Stripe Dashboard. customer.subscription.deleted/updated must be
 * added there (Developers → Webhooks → this endpoint) for the handlers
 * below to ever run — this cannot be done from application code. See the
 * recovery report for this and the companion
 * supabase/migrations/20261017_add_stripe_subscription_tracking.sql
 * migration, neither of which has been applied yet.
 *
 * Every other event type — in particular invoice.* — is explicitly
 * no-op'd: renewal commissioning is deferred to Sprint 2b and must not
 * be inferred from this handler existing.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionEnded(event);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event);
        break;
      default:
        // Explicit no-op. Never 500 on business no-ops or Stripe retries forever.
        console.log(`[webhook] ignoring event type: ${event.type}`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook] handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  // A fully-discounted checkout (100%-off promo code) never has a charge
  // to collect, so Stripe reports payment_status as "no_payment_required"
  // instead of "paid" — the redeemed subscription is otherwise completely
  // real and should still fulfill Pro. Only "unpaid" (checkout opened but
  // payment didn't go through) skips fulfillment.
  if (
    session.payment_status !== "paid" &&
    session.payment_status !== "no_payment_required"
  ) {
    console.log(
      `[webhook] checkout.session.completed with payment_status=${session.payment_status}, skipping`,
    );
    return;
  }

  const listingId =
    (session.metadata?.listing_id as string | undefined) ||
    session.client_reference_id ||
    undefined;
  const plan = (session.metadata?.plan as string | undefined) || "pro";
  // Set server-side by create-checkout-session from the authenticated
  // user's own session — never client-supplied, never inferred from email.
  // Reliable enough to assign ownership directly.
  const vendorId = session.metadata?.vendor_id as string | undefined;
  const repCode = session.metadata?.rep_code as string | undefined;
  const saleAmountCents = session.amount_total ?? 0;

  if (!listingId) {
    console.log(
      "[webhook] checkout.session.completed with no listing_id/client_reference_id — house sale, unattributable",
    );
    return;
  }

  const supabase = createServerClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("comped, owner_id")
    .eq("id", listingId)
    .single();

  // --- Pro fulfillment: idempotent, runs before commission attribution so
  // even an unattributed house sale still grants Pro access. ---
  if (plan === "pro") {
    const existingOwnerId = listing?.owner_id ?? null;

    if (vendorId && existingOwnerId && existingOwnerId !== vendorId) {
      // Genuine data-identity conflict: this listing already belongs to a
      // different account than the one that paid. create-checkout-session
      // doesn't verify listing ownership before creating a session, so
      // this can happen on misuse. Do not reassign ownership or flip plan
      // automatically — surface for manual review instead.
      console.error(
        `[webhook] OWNERSHIP CONFLICT: listing ${listingId} is owned by ${existingOwnerId}, but checkout session ${session.id} was paid by ${vendorId}. Skipping plan/ownership fulfillment.`,
      );
    } else {
      const fulfillmentUpdate: Record<string, unknown> = {
        plan: "Pro",
        updated_at: new Date().toISOString(),
      };
      if (vendorId) {
        fulfillmentUpdate.owner_id = vendorId;
        fulfillmentUpdate.is_claimed = true;
        fulfillmentUpdate.pending_claim_email = null;
        fulfillmentUpdate.stripe_session_id = null;
      }

      const { error: fulfillError } = await supabase
        .from("listings")
        .update(fulfillmentUpdate)
        .eq("id", listingId);

      if (fulfillError) {
        console.error("[webhook] failed to fulfill Pro upgrade:", fulfillError);
        throw fulfillError; // Stripe retries
      }

      if (vendorId) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_plan: "Pro",
            stripe_customer_id: (session.customer as string) || null,
          })
          .eq("id", vendorId);

        if (profileError) {
          console.error(
            "[webhook] failed to update profile after fulfillment:",
            profileError,
          );
          throw profileError; // Stripe retries
        }
      }

      console.log(`[webhook] fulfilled Pro upgrade for listing ${listingId}`);

      // Record which subscription granted this Pro status, so a later
      // customer.subscription.deleted/updated event (which carries a
      // subscription id, not a listing id) can find its way back to this
      // listing and downgrade it — see handleSubscriptionEnded below.
      // Isolated from the fulfillment update above and never thrown: the
      // supabase/migrations/20261017_add_stripe_subscription_tracking.sql
      // migration may not have been applied yet, and a missing column
      // here must never block granting Pro access itself.
      const subscriptionId = (session.subscription as string) || null;
      if (subscriptionId) {
        const { error: subIdError } = await supabase
          .from("listings")
          .update({ stripe_subscription_id: subscriptionId })
          .eq("id", listingId);
        if (subIdError) {
          console.warn(
            "[webhook] could not record stripe_subscription_id (has supabase/migrations/20261017_add_stripe_subscription_tracking.sql been applied?) — subscription cancellation/renewal handling will no-op for this listing until it is:",
            subIdError,
          );
        }
      }
    }
  }

  const { data: activeAssignmentRow } = await supabase
    .from("rep_assignments")
    .select("rep_id, assigned_at")
    .eq("listing_id", listingId)
    .eq("status", "active")
    .maybeSingle();

  let repCodeLookup: { repId: string; active: boolean } | null = null;
  if (repCode) {
    const { data: codeRow } = await supabase
      .from("rep_codes")
      .select("rep_id, active")
      .eq("code", repCode)
      .maybeSingle();
    if (codeRow) {
      repCodeLookup = { repId: codeRow.rep_id, active: codeRow.active };
    }
  }

  const attribution = resolveAttribution({
    plan,
    comped: Boolean(listing?.comped),
    // Admin-initiated upgrades go through direct DB writes (adminUpdateListing),
    // never through this checkout session — structurally never true here.
    isAdminInitiated: false,
    activeAssignment: activeAssignmentRow
      ? {
          repId: activeAssignmentRow.rep_id,
          assignedAt: new Date(activeAssignmentRow.assigned_at),
        }
      : null,
    attributionWindowDays: ATTRIBUTION_WINDOW_DAYS,
    now: new Date(),
    repCode,
    repCodeLookup,
  });

  if (attribution.attributed === false) {
    console.log(
      `[webhook] no commission for listing ${listingId}: ${attribution.reason}`,
    );
    return;
  }

  const commission = computeCommission(plan, saleAmountCents);
  if (!commission) {
    console.log(`[webhook] plan "${plan}" not commissionable, skipping`);
    return;
  }
  if (commission.priceDrift) {
    console.warn(
      `[webhook] price drift: sale_amount_cents=${saleAmountCents} for plan ${plan}`,
    );
  }

  const { error } = await supabase.from("rep_commissions").insert({
    rep_id: attribution.repId,
    listing_id: listingId,
    stripe_event_id: event.id,
    stripe_session_id: session.id,
    stripe_subscription_id: (session.subscription as string) || null,
    plan,
    sale_type: "new_sale",
    sale_amount_cents: saleAmountCents,
    tier_rate: commission.tierRate,
    amount_cents: commission.amountCents,
    kind: "commission",
    status: "pending",
    attribution_source: attribution.source,
    attribution_note: attribution.note || null,
  });

  if (error) {
    // Unique violation on stripe_event_id = Stripe retry, already recorded. No-op.
    if (error.code === "23505") {
      console.log(`[webhook] duplicate event ${event.id}, already recorded`);
      return;
    }
    console.error("[webhook] failed to insert commission:", error);
    throw error;
  }
}

/**
 * Terminal, non-paying Stripe subscription statuses. "past_due" is
 * deliberately excluded: Stripe is still retrying the payment and the
 * subscriber's current entitlement period hasn't ended, so Pro access
 * must not be pulled yet (see recovery audit, Phase 1C Task 7 — "A
 * cancellation request should not automatically remove paid benefits
 * before the subscription's actual entitlement period ends"). A
 * cancel-at-period-end request keeps status "active" (with
 * cancel_at_period_end: true) until the period actually ends, at which
 * point Stripe sends customer.subscription.deleted — handled separately
 * below and always treated as terminal regardless of status.
 */
const TERMINAL_SUBSCRIPTION_STATUSES: ReadonlySet<Stripe.Subscription.Status> =
  new Set<Stripe.Subscription.Status>([
    "canceled",
    "unpaid",
    "incomplete_expired",
  ]);

/**
 * Downgrades every listing whose stripe_subscription_id matches, and the
 * owning profile if it's still linked to that listing. No-ops (logs and
 * returns) rather than throwing if the tracking column from
 * supabase/migrations/20261017_add_stripe_subscription_tracking.sql
 * hasn't been applied yet, or if no listing is tracking this
 * subscription (e.g. it predates that migration) — there's nothing
 * Stripe retrying this event will fix in either case.
 */
async function downgradeListingsForSubscription(
  subscriptionId: string,
  reason: string,
) {
  const supabase = createServerClient();

  const { data: listings, error: lookupError } = await supabase
    .from("listings")
    .select("id, owner_id, comped")
    .eq("stripe_subscription_id", subscriptionId);

  if (lookupError) {
    console.warn(
      `[webhook] could not look up listings for subscription ${subscriptionId} (has the stripe_subscription_id migration been applied?), skipping ${reason}:`,
      lookupError,
    );
    return;
  }

  if (!listings || listings.length === 0) {
    console.log(
      `[webhook] ${reason} for subscription ${subscriptionId}, no listing is tracking it (predates the tracking migration, or already downgraded)`,
    );
    return;
  }

  for (const listing of listings) {
    // A comped listing is treated as Pro by the commission logic but was
    // never actually backed by this (or any) Stripe subscription; never
    // let a subscription event touch it.
    if (listing.comped) continue;

    const { error: downgradeError } = await supabase
      .from("listings")
      .update({
        plan: "Free",
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listing.id);

    if (downgradeError) {
      console.error(
        `[webhook] failed to downgrade listing ${listing.id} after ${reason}:`,
        downgradeError,
      );
      throw downgradeError; // Stripe retries
    }

    console.log(
      `[webhook] downgraded listing ${listing.id} to Free (${reason})`,
    );

    if (listing.owner_id) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ subscription_plan: "Free" })
        .eq("id", listing.owner_id);

      if (profileError) {
        console.error(
          `[webhook] failed to update profile ${listing.owner_id} after ${reason}:`,
          profileError,
        );
        throw profileError; // Stripe retries
      }
    }
  }
}

/**
 * The subscription's final end (whether it ran its course after
 * cancel_at_period_end, or was canceled immediately). Always terminal,
 * regardless of the status Stripe reports on the deleted object.
 */
async function handleSubscriptionEnded(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  await downgradeListingsForSubscription(subscription.id, "subscription ended");
}

/**
 * Fires on every subscription change, not just problems — plan changes,
 * cancel_at_period_end being toggled, and (what we act on here) a move
 * into a terminal non-paying status such as a payment that finally
 * failed for good. See TERMINAL_SUBSCRIPTION_STATUSES for what counts.
 */
async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  if (!TERMINAL_SUBSCRIPTION_STATUSES.has(subscription.status)) {
    console.log(
      `[webhook] customer.subscription.updated for ${subscription.id} with non-terminal status=${subscription.status}, no-op`,
    );
    return;
  }
  await downgradeListingsForSubscription(
    subscription.id,
    `subscription status=${subscription.status}`,
  );
}

async function handleChargeRefunded(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;

  let subscriptionId: string | null = null;
  if (charge.invoice) {
    try {
      const invoice = await stripe.invoices.retrieve(charge.invoice as string);
      subscriptionId = (invoice.subscription as string) || null;
    } catch (e) {
      console.error("[webhook] failed to retrieve invoice:", e);
    }
  }

  if (!subscriptionId) {
    console.log(
      "[webhook] charge.refunded with no linked subscription, skipping",
    );
    return;
  }

  const supabase = createServerClient();
  const { data: commission } = await supabase
    .from("rep_commissions")
    .select("*")
    .eq("stripe_subscription_id", subscriptionId)
    .eq("kind", "commission")
    .maybeSingle();

  if (!commission) {
    console.log(
      `[webhook] charge.refunded for subscription ${subscriptionId}, no matching commission row`,
    );
    return;
  }

  if (commission.status === "pending" || commission.status === "approved") {
    await supabase
      .from("rep_commissions")
      .update({
        status: "clawed_back",
        status_changed_at: new Date().toISOString(),
      })
      .eq("id", commission.id);
    return;
  }

  if (commission.status === "paid") {
    const adjustmentAmount = computeRefundAdjustment(
      commission.amount_cents,
      commission.sale_amount_cents,
      charge.amount_refunded,
    );

    const { error } = await supabase.from("rep_commissions").insert({
      rep_id: commission.rep_id,
      listing_id: commission.listing_id,
      stripe_event_id: event.id,
      stripe_session_id: commission.stripe_session_id,
      stripe_subscription_id: commission.stripe_subscription_id,
      plan: commission.plan,
      sale_type: commission.sale_type,
      sale_amount_cents: commission.sale_amount_cents,
      tier_rate: commission.tier_rate,
      amount_cents: adjustmentAmount,
      kind: "adjustment",
      status: "clawed_back",
      attribution_source: commission.attribution_source,
      attribution_note: `Refund adjustment for commission ${commission.id}`,
    });

    if (error && error.code !== "23505") {
      console.error("[webhook] failed to insert adjustment:", error);
      throw error;
    }
  }
  // clawed_back rows are already terminal — nothing further to do.
}
