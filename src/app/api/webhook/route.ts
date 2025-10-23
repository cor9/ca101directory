import { sendMessageToDiscord } from "@/lib/discord";
import { sendAdminUpgradeNotification } from "@/lib/mail";
import { createServerClient } from "@/lib/supabase";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Main Stripe webhook handler for Child Actor 101 Directory
 * Handles checkout.session.completed events for claim and upgrade flow
 */
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

      console.log("Processing checkout.session.completed:", {
        sessionId: session.id,
        metadata: session.metadata,
        customer: session.customer,
      });

      const vendorId = session.metadata?.vendor_id;
      const listingId = session.metadata?.listing_id;
      const plan = session.metadata?.plan;
      const billingCycle = session.metadata?.billing_cycle;

      if (!vendorId || !listingId || !plan) {
        console.warn("Missing required metadata in checkout session, acknowledging to Stripe and skipping processing:", {
          vendorId,
          listingId,
          plan,
          allMetadata: session.metadata,
        });
        // Acknowledge to Stripe to avoid retries/disablement, but skip our processing
        return NextResponse.json({ received: true, skipped: true });
      }

      const supabase = createServerClient();

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

        // 2. Update listing with plan and claim status
        const { error: listingError } = await supabase
          .from("listings")
          .update({
            owner_id: vendorId,
            is_claimed: true,
            plan: plan,
            updated_at: new Date().toISOString(),
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

        // Notify admin non-blocking
        try {
          const { data: listingData } = await supabase
            .from("listings")
            .select("listing_name")
            .eq("id", listingId)
            .single();
          const listingName = listingData?.listing_name || listingId;
          await sendAdminUpgradeNotification(
            listingName,
            listingId,
            plan,
            billingCycle,
            vendorId,
          );

          // Always send Discord notification
          try {
            const amount =
              typeof session.amount_total === "number"
                ? session.amount_total / 100
                : 0;
            const userName =
              session.customer_details?.name ||
              session.customer_details?.email ||
              "Unknown";
            await sendMessageToDiscord(
              session.id,
              String(session.customer ?? "unknown"),
              userName,
              amount,
            );
          } catch (discordErr) {
            console.warn("Discord notification failed:", discordErr);
          }
        } catch (notifyError) {
          console.error("Failed to notify admin of upgrade:", notifyError);
          // Fallback to Discord notification if configured
          try {
            const amount =
              typeof session.amount_total === "number"
                ? session.amount_total / 100
                : 0;
            const userName =
              session.customer_details?.name ||
              session.customer_details?.email ||
              "Unknown";
            await sendMessageToDiscord(
              session.id,
              String(session.customer ?? "unknown"),
              userName,
              amount,
            );
          } catch (discordErr) {
            console.warn("Discord fallback failed:", discordErr);
          }
        }
      } catch (error) {
        console.error("Error processing claim:", error);
        return NextResponse.json(
          { error: "Failed to process claim" },
          { status: 500 },
        );
      }
    } else if (event.type === "customer.subscription.created") {
      const subscription = event.data.object as Stripe.Subscription;

      console.log("Processing subscription.created:", {
        subscriptionId: subscription.id,
        customerId: subscription.customer,
        status: subscription.status,
      });

      // For subscription events, we need to get the customer details
      // and potentially the checkout session to retrieve metadata
      const customer = await stripe.customers.retrieve(
        subscription.customer as string,
      );

      // Check if customer is deleted
      if (customer.deleted) {
        console.log("Customer has been deleted:", customer.id);
        return NextResponse.json({ received: true });
      }

      // Cast to Customer type after checking it's not deleted
      const activeCustomer = customer as Stripe.Customer;

      console.log("Customer details:", {
        id: activeCustomer.id,
        email: activeCustomer.email,
        metadata: activeCustomer.metadata,
      });

      // If we have vendor info in customer metadata, update the profile
      if (activeCustomer.metadata?.vendor_id) {
        const supabase = createServerClient();

        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              stripe_customer_id: activeCustomer.id,
            })
            .eq("id", activeCustomer.metadata.vendor_id);

          if (profileError) {
            console.error(
              "Error updating profile from subscription:",
              profileError,
            );
          } else {
            console.log(
              "✅ Updated profile from subscription:",
              activeCustomer.metadata.vendor_id,
            );
          }
        } catch (error) {
          console.error("Error processing subscription:", error);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

// Health check: non-sensitive booleans to verify env/config in Production
export async function GET() {
  try {
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    return NextResponse.json({ ok: true, hasSecretKey, hasWebhookSecret });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
