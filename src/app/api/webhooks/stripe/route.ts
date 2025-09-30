import { createClient } from "@/lib/supabase/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Received Stripe webhook event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const vendorId = session.metadata?.vendor_id;
      const listingId = session.metadata?.listing_id;
      const plan = session.metadata?.plan;
      const billingCycle = session.metadata?.billing_cycle;

      if (!vendorId || !listingId || !plan) {
        console.error("Missing required metadata in checkout session:", {
          vendorId,
          listingId,
          plan,
        });
        return NextResponse.json(
          { error: "Missing metadata" },
          { status: 400 },
        );
      }

      const supabase = createClient();

      try {
        // 1. Insert claim row
        const { error: claimError } = await supabase.from("claims").insert({
          listing_id: listingId,
          vendor_id: vendorId,
          message: `Auto-claim via Stripe checkout - ${plan} plan (${billingCycle})`,
          approved: false,
        });

        if (claimError) {
          console.error("Error inserting claim:", claimError);
          throw claimError;
        }

        // 2. Update listing
        const { error: listingError } = await supabase
          .from("listings")
          .update({
            owner_id: vendorId,
            claimed: true,
          })
          .eq("id", listingId);

        if (listingError) {
          console.error("Error updating listing:", listingError);
          throw listingError;
        }

        // 3. Update vendor profile with plan
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            subscription_plan: plan,
            billing_cycle: billingCycle,
            stripe_customer_id: session.customer as string,
          })
          .eq("id", vendorId);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          throw profileError;
        }

        console.log("✅ Successfully processed claim for:", {
          vendorId,
          listingId,
          plan,
          billingCycle,
        });
      } catch (error) {
        console.error("Error processing claim:", error);
        return NextResponse.json(
          { error: "Failed to process claim" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
