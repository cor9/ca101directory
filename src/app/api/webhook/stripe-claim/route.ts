import { updateListingClaim } from "@/lib/airtable";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

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

        // Extract metadata
        const listingSlug = session.metadata?.listingSlug;
        const businessName = session.metadata?.businessName;
        const plan = session.metadata?.plan;

        if (!listingSlug || !businessName || !session.customer_email) {
          console.error("Missing required metadata in checkout session");
          return NextResponse.json(
            { error: "Missing metadata" },
            { status: 400 },
          );
        }

        // Find the listing by business name
        const { getListingById } = await import("@/lib/airtable");
        const businessNameFromSlug = listingSlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const listing = await getListingById(businessNameFromSlug);

        if (!listing) {
          console.error("Listing not found:", businessNameFromSlug);
          return NextResponse.json(
            { error: "Listing not found" },
            { status: 404 },
          );
        }

        // Update the listing with claim information
        const claimDate = new Date().toISOString();
        const success = await updateListingClaim(listing.id, {
          claimed: true,
          claimedByEmail: session.customer_email,
          claimDate: claimDate,
          verificationStatus: "Pending",
          plan: plan || "Free",
        });

        if (!success) {
          console.error("Failed to update listing claim status");
          return NextResponse.json(
            { error: "Failed to update listing" },
            { status: 500 },
          );
        }

        console.log(
          `Successfully processed claim for listing: ${listing.businessName}`,
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
