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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_MAIN || "";

/**
 * Canonical commission-attribution webhook. Handles ONLY
 * checkout.session.completed (new-sale attribution) and charge.refunded
 * (clawback/adjustment). Every other event type — in particular
 * invoice.* and customer.subscription.* — is explicitly no-op'd: renewal
 * commissioning is deferred to Sprint 2b and must not be inferred from
 * this handler existing.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET_MAIN is not configured");
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
        console.log(`[webhook/stripe] ignoring event type: ${event.type}`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook/stripe] handler error:", error);
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
      `[webhook/stripe] checkout.session.completed with payment_status=${session.payment_status}, skipping`,
    );
    return;
  }

  const listingId =
    (session.metadata?.listing_id as string | undefined) ||
    session.client_reference_id ||
    undefined;
  const plan = (session.metadata?.plan as string | undefined) || "pro";
  const repCode = session.metadata?.rep_code as string | undefined;
  const saleAmountCents = session.amount_total ?? 0;

  if (!listingId) {
    console.log(
      "[webhook/stripe] checkout.session.completed with no listing_id/client_reference_id — house sale, unattributable",
    );
    return;
  }

  const supabase = createServerClient();

  const { data: listing } = await supabase
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
      `[webhook/stripe] no commission for listing ${listingId}: ${attribution.reason}`,
    );
    return;
  }

  const commission = computeCommission(plan, saleAmountCents);
  if (!commission) {
    console.log(`[webhook/stripe] plan "${plan}" not commissionable, skipping`);
    return;
  }
  if (commission.priceDrift) {
    console.warn(
      `[webhook/stripe] price drift: sale_amount_cents=${saleAmountCents} for plan ${plan}`,
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
      console.log(
        `[webhook/stripe] duplicate event ${event.id}, already recorded`,
      );
      return;
    }
    console.error("[webhook/stripe] failed to insert commission:", error);
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
      console.error("[webhook/stripe] failed to retrieve invoice:", e);
    }
  }

  if (!subscriptionId) {
    console.log(
      "[webhook/stripe] charge.refunded with no linked subscription, skipping",
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
      `[webhook/stripe] charge.refunded for subscription ${subscriptionId}, no matching commission row`,
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
      console.error("[webhook/stripe] failed to insert adjustment:", error);
      throw error;
    }
  }
  // clawed_back rows are already terminal — nothing further to do.
}
