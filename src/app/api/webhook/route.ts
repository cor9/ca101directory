import { sendDiscordNotification } from "@/lib/discord";
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
        customerEmail: session.customer_details?.email,
        clientReferenceId: session.client_reference_id,
        mode: session.mode,
      });

      const supabase = createServerClient();

      // Extract metadata
      let vendorId = session.metadata?.vendor_id;
      let listingId = session.metadata?.listing_id;
      let plan = session.metadata?.plan;
      let billingCycle = session.metadata?.billing_cycle;

      // For Stripe Pricing Table checkouts, listing_id comes from client_reference_id
      if (!listingId && session.client_reference_id) {
        listingId = session.client_reference_id;
        console.log(
          "[Pricing Table] Using client_reference_id as listing_id:",
          listingId,
        );
      }

      // If plan is not in metadata, detect it from line items (Pricing Table scenario)
      if (!plan && session.mode === "subscription") {
        console.log(
          "[Pricing Table] Plan not in metadata, retrieving line items...",
        );

        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id,
            { limit: 1 },
          );
          const firstItem = lineItems.data[0];

          if (firstItem?.price) {
            const priceId =
              typeof firstItem.price === "string"
                ? firstItem.price
                : firstItem.price.id;
            const priceAmount =
              typeof firstItem.price === "object"
                ? firstItem.price.unit_amount
                : 0;
            const priceInterval =
              typeof firstItem.price === "object"
                ? firstItem.price.recurring?.interval
                : null;

            console.log("[Pricing Table] Line item details:", {
              priceId,
              priceAmount,
              priceInterval,
            });

            // Determine plan based on price amount
            // Standard: $25/month or $250/year
            // Pro: $50/month or $500/year
            if (priceAmount === 2500 || priceAmount === 25000) {
              plan = "Standard";
              billingCycle = priceAmount === 2500 ? "monthly" : "yearly";
            } else if (priceAmount === 5000 || priceAmount === 50000) {
              plan = "Pro";
              billingCycle = priceAmount === 5000 ? "monthly" : "yearly";
            }

            console.log("[Pricing Table] Detected plan:", {
              plan,
              billingCycle,
            });
          }
        } catch (err) {
          console.error("[Pricing Table] Error fetching line items:", err);
        }
      }

      // Try to find vendor_id from listing if not provided
      if (listingId && !vendorId) {
        console.log(
          "[Pricing Table] No vendor_id in metadata, looking up listing owner...",
        );

        try {
          const { data: listingData, error: listingError } = await supabase
            .from("listings")
            .select("owner_id")
            .eq("id", listingId)
            .single();

          if (!listingError && listingData?.owner_id) {
            vendorId = listingData.owner_id;
            console.log(
              "[Pricing Table] Found vendor_id from listing:",
              vendorId,
            );
          } else {
            console.log(
              "[Pricing Table] No owner_id found for listing, will use customer email",
            );
          }
        } catch (err) {
          console.error("[Pricing Table] Error looking up listing:", err);
        }
      }

      // If we still don't have vendor_id, try to find user by email
      if (!vendorId && session.customer_details?.email) {
        console.log(
          "[Pricing Table] Looking up user by email:",
          session.customer_details.email,
        );

        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("email", session.customer_details.email)
            .single();

          if (!userError && userData?.id) {
            vendorId = userData.id;
            console.log("[Pricing Table] Found vendor_id by email:", vendorId);
          }
        } catch (err) {
          console.error("[Pricing Table] Error looking up user by email:", err);
        }
      }

      // Final validation
      if (!listingId || !plan) {
        console.warn(
          "[Webhook] Missing required data, acknowledging but skipping processing:",
          {
            vendorId,
            listingId,
            plan,
            billingCycle,
            clientReferenceId: session.client_reference_id,
            customerEmail: session.customer_details?.email,
            allMetadata: session.metadata,
          },
        );
        return NextResponse.json({ received: true, skipped: true });
      }

      if (!vendorId) {
        console.error(
          "[Webhook] Could not determine vendor_id, cannot process checkout:",
          {
            listingId,
            plan,
            customerEmail: session.customer_details?.email,
          },
        );
        return NextResponse.json({
          received: true,
          error: "Could not determine vendor",
        });
      }

      console.log("[Webhook] Processing with:", {
        vendorId,
        listingId,
        plan,
        billingCycle,
      });

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
            await sendDiscordNotification("💳 Purchase Completed", [
              { name: "User", value: userName, inline: true },
              { name: "Amount", value: `$${amount.toFixed(2)}`, inline: true },
              { name: "Listing", value: listingName, inline: false },
              { name: "Plan", value: plan, inline: true },
              { name: "Billing", value: billingCycle || "N/A", inline: true },
              { name: "Session", value: `\`${session.id}\``, inline: false },
            ]);
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
            await sendDiscordNotification("💳 Purchase Completed", [
              { name: "User", value: userName, inline: true },
              { name: "Amount", value: `$${amount.toFixed(2)}`, inline: true },
              { name: "Listing", value: listingId, inline: false },
              { name: "Plan", value: plan, inline: true },
              { name: "Billing", value: billingCycle || "N/A", inline: true },
              { name: "Session", value: `\`${session.id}\``, inline: false },
            ]);
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
