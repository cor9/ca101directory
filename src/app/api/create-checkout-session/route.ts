import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

// Plan pricing (in cents)
const PLAN_PRICES = {
  standard: {
    monthly: 2500, // $25.00
    yearly: 25000, // $250.00
  },
  pro: {
    monthly: 5000, // $50.00
    yearly: 50000, // $500.00
  },
};

export async function POST(request: NextRequest) {
  try {
    console.log("Starting checkout session creation...");
    
    const session = await auth();
    console.log("Auth session:", { userId: session?.user?.id, email: session?.user?.email });
    
    if (!session?.user?.id) {
      console.log("No user session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Request body:", body);
    const { listingId, planId, billingCycle, successUrl, cancelUrl } = body;

    if (!listingId || !planId || !billingCycle || !successUrl || !cancelUrl) {
      console.log("Missing required parameters:", { listingId, planId, billingCycle, successUrl, cancelUrl });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!PLAN_PRICES[planId as keyof typeof PLAN_PRICES]) {
      console.log("Invalid plan ID:", planId);
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    const price = PLAN_PRICES[planId as keyof typeof PLAN_PRICES][billingCycle as keyof typeof PLAN_PRICES.standard];
    console.log("Calculated price:", price, "for plan:", planId, "cycle:", billingCycle);
    
    if (!price) {
      console.log("Invalid billing cycle:", billingCycle);
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    console.log("Creating Stripe checkout session...");
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan - Claim Listing`,
              description: `Claim and upgrade your business listing with ${planId} plan`,
            },
            unit_amount: price,
            recurring: billingCycle === "yearly" ? {
              interval: "year",
            } : {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        vendor_id: session.user.id,
        listing_id: listingId,
        plan: planId,
        billing_cycle: billingCycle,
      },
      customer_email: session.user.email || undefined,
    });

    console.log("Checkout session created successfully:", checkoutSession.id);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
