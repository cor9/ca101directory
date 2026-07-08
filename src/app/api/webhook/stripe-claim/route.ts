import { sendDiscordNotification } from "@/lib/discord";
import { createServerClient } from "@/lib/supabase";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
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
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const listingId = session.metadata?.listing_id;
        const userId = session.metadata?.user_id || session.metadata?.vendor_id;
        const plan = session.metadata?.plan;

        if (!listingId || !plan || !userId) {
          console.error("Missing required metadata in checkout session", {
            listingId,
            plan,
            userId,
          });
          return NextResponse.json(
            { error: "Missing metadata" },
            { status: 400 },
          );
        }

        const planMap: Record<string, string> = {
          standard: "Standard",
          pro: "Pro",
          "founding-standard": "Founding Standard",
          "founding-pro": "Founding Pro",
        };

        const normalizedPlan = planMap[plan] || plan;
        const supabase = createServerClient();

        const { error: updateError } = await supabase
          .from("listings")
          .update({
            plan: normalizedPlan,
            is_active: true,
            is_claimed: true,
            owner_id: userId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", listingId);

        if (updateError) {
          console.error(
            "Failed to update listing after checkout:",
            updateError,
          );
          return NextResponse.json(
            { error: "Failed to update listing" },
            { status: 500 },
          );
        }

        sendDiscordNotification("💳 Listing Upgraded", [
          { name: "Listing ID", value: listingId, inline: true },
          { name: "Plan", value: normalizedPlan, inline: true },
          { name: "User", value: userId, inline: true },
        ]).catch((e) =>
          console.warn("Discord upgrade notification failed:", e),
        );

        console.log(
          `Successfully processed upgrade for listing ${listingId} to ${normalizedPlan}`,
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
