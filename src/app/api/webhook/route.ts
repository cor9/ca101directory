import {
  type WebhookSupabaseClient,
  isTerminalSubscriptionStatus,
  performProFulfillment,
  performSubscriptionDowngrade,
  recordCommissionAttribution,
} from "@/lib/billing/webhook-core";
import { computeRefundAdjustment } from "@/lib/commission";
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
 * Casts the real supabase-js client to the loose test-seam interface
 * lib/billing/webhook-core.ts's functions are typed against — see
 * update-listing-core.ts for why TypeScript can't structurally match
 * supabase-js's own generics here. Runtime shape is identical; the fake
 * client in scripts/test-helpers/fake-supabase.ts satisfies the same
 * interface for scripts/test-webhook-and-ownership.ts.
 */
function dbClient(): WebhookSupabaseClient {
  return createServerClient() as unknown as WebhookSupabaseClient;
}

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
 *   period actually ends — see lib/billing/webhook-core.ts's
 *   isTerminalSubscriptionStatus.
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
 *
 * The authorization/idempotency/targeting logic itself lives in
 * lib/billing/webhook-core.ts, independent of the real Supabase client
 * and the Stripe SDK's event types, so it's unit tested directly — see
 * scripts/test-webhook-and-ownership.ts and the recovery report's Task 2
 * notes on subscription-to-listing association, idempotency, and
 * before/after migration behavior.
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

  const supabase = dbClient();

  // --- Pro fulfillment: idempotent, runs before commission attribution so
  // even an unattributed house sale still grants Pro access. ---
  if (plan === "pro") {
    const result = await performProFulfillment(supabase, {
      listingId,
      vendorId,
      stripeSubscriptionId: (session.subscription as string) || null,
      stripeCustomerId: (session.customer as string) || null,
    });

    if (result.outcome === "ownership_conflict") {
      // create-checkout-session now verifies listing ownership/claim
      // tokens before a session can even be created (see
      // lib/listings/listing-ownership.ts's canPurchaseProForListing),
      // so this should be unreachable going forward; kept as a
      // defense-in-depth backstop for sessions created before that fix
      // or by any other path. Never reassign ownership automatically —
      // surface for manual review instead.
      console.error(
        `[webhook] OWNERSHIP CONFLICT: listing ${listingId} is owned by ${result.existingOwnerId}, but checkout session ${session.id} was paid by ${vendorId}. Skipping plan/ownership fulfillment.`,
      );
    } else if (result.outcome === "error") {
      console.error("[webhook] failed to fulfill Pro upgrade:", result.message);
      throw new Error(result.message); // Stripe retries
    } else {
      console.log(`[webhook] fulfilled Pro upgrade for listing ${listingId}`);
    }
  }

  // Comped status is read fresh for commission attribution; fulfillment
  // above doesn't touch it.
  const { data: listingForAttribution } = await supabase
    .from("listings")
    .select("comped")
    .eq("id", listingId)
    .single();

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

  const attributionResult = await recordCommissionAttribution(supabase, {
    listingId,
    plan,
    comped: Boolean(listingForAttribution?.comped),
    activeAssignment: activeAssignmentRow
      ? {
          repId: activeAssignmentRow.rep_id,
          assignedAt: new Date(activeAssignmentRow.assigned_at),
        }
      : null,
    repCode,
    repCodeLookup,
    saleAmountCents,
    stripeEventId: event.id,
    stripeSessionId: session.id,
    stripeSubscriptionId: (session.subscription as string) || null,
    now: new Date(),
  });

  if (attributionResult.recorded === false) {
    if ("duplicate" in attributionResult) {
      console.log(`[webhook] duplicate event ${event.id}, already recorded`);
    } else {
      console.log(
        `[webhook] no commission for listing ${listingId}: ${attributionResult.reason}`,
      );
    }
  }
}

async function handleSubscriptionEnded(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const result = await performSubscriptionDowngrade(
    dbClient(),
    subscription.id,
  );
  logDowngradeResult(subscription.id, "subscription ended", result);
}

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  if (!isTerminalSubscriptionStatus(subscription.status)) {
    console.log(
      `[webhook] customer.subscription.updated for ${subscription.id} with non-terminal status=${subscription.status}, no-op`,
    );
    return;
  }
  const result = await performSubscriptionDowngrade(
    dbClient(),
    subscription.id,
  );
  logDowngradeResult(
    subscription.id,
    `subscription status=${subscription.status}`,
    result,
  );
}

function logDowngradeResult(
  subscriptionId: string,
  reason: string,
  result: Awaited<ReturnType<typeof performSubscriptionDowngrade>>,
) {
  if (!result.migrationApplied) {
    console.warn(
      `[webhook] could not look up listings for subscription ${subscriptionId} (has supabase/migrations/20261017_add_stripe_subscription_tracking.sql been applied?), skipping ${reason}`,
    );
    return;
  }
  if (
    result.listingsDowngraded.length === 0 &&
    result.listingsSkippedAsComped.length === 0
  ) {
    console.log(
      `[webhook] ${reason} for subscription ${subscriptionId}, no listing is tracking it (predates the tracking migration, or already downgraded)`,
    );
    return;
  }
  for (const id of result.listingsDowngraded) {
    console.log(`[webhook] downgraded listing ${id} to Free (${reason})`);
  }
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
