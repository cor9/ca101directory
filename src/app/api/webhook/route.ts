import { sendDiscordNotification } from "@/lib/discord";
import { sendAdminUpgradeNotification } from "@/lib/mail";
import { createServerClient } from "@/lib/supabase";
import { processCheckoutSessionCompleted } from "@/lib/stripe/checkout-session-processor";
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
        customerEmail: session.customer_details?.email,
        clientReferenceId: session.client_reference_id,
        mode: session.mode,
      });

      const supabase = createServerClient();
      const outcome = await processCheckoutSessionCompleted(session, {
        supabase,
        stripe,
        notifyAdmin: sendAdminUpgradeNotification,
        notifyDiscord: sendDiscordNotification,
      });

      return NextResponse.json(outcome.payload, { status: outcome.status });
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
    } else if (event.type === "charge.succeeded") {
      // Send Discord for successful charges (fallback when checkout session isn't present)
      try {
        const charge = event.data.object as Stripe.Charge;
        const amount =
          typeof charge.amount === "number" ? charge.amount / 100 : 0;
        const email = charge.billing_details?.email || "Unknown";
        const method =
          charge.payment_method_details &&
          "type" in charge.payment_method_details
            ? String((charge.payment_method_details as { type: string }).type)
            : "unknown";
        await sendDiscordNotification("💳 Charge Succeeded", [
          { name: "Email", value: email, inline: true },
          { name: "Amount", value: `$${amount.toFixed(2)}`, inline: true },
          { name: "Method", value: String(method).toUpperCase(), inline: true },
          { name: "Charge", value: `\`${charge.id}\``, inline: false },
        ]);
      } catch (e) {
        console.warn("Discord notification for charge.succeeded failed:", e);
      }
    } else if (event.type === "payment_intent.succeeded") {
      // Send Discord for successful payment intents (another safety net)
      try {
        const pi = event.data.object as Stripe.PaymentIntent;
        const amount = typeof pi.amount === "number" ? pi.amount / 100 : 0;
        const email = "Unknown";
        await sendDiscordNotification("✅ PaymentIntent Succeeded", [
          { name: "Email", value: email, inline: true },
          { name: "Amount", value: `$${amount.toFixed(2)}`, inline: true },
          { name: "PaymentIntent", value: `\`${pi.id}\``, inline: false },
        ]);
      } catch (e) {
        console.warn(
          "Discord notification for payment_intent.succeeded failed:",
          e,
        );
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
