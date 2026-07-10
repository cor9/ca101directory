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
 * - charge.refunded: commission clawback/adjustment.
 *
 * Fulfillment restores the server-side checkout-completion logic that used
 * to live at this URL (deleted in commit 688e3f16, never restored) — this
 * is the source of truth for granting Pro access now; payment-success is
 * UX confirmation only.
 *
 * Every other event type — in particular invoice.* and
 * customer.subscription.* — is explicitly no-op'd: renewal commissioning
 * is deferred to Sprint 2b and must not be inferred from this handler
 * existing.
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

  if (session.payment_status !== "paid") {
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
