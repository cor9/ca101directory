import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
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
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, planId, billingCycle, successUrl, cancelUrl } = body;

    if (!listingId || !planId || !billingCycle || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!PLAN_PRICES[planId as keyof typeof PLAN_PRICES]) {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    const price = PLAN_PRICES[planId as keyof typeof PLAN_PRICES][billingCycle as keyof typeof PLAN_PRICES.standard];
    
    if (!price) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
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

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
