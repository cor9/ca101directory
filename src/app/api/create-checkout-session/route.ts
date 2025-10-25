import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { verifyClaimToken } from "@/lib/tokens";

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
    console.log("Starting checkout session creation...");

    const session = await auth();
    console.log("Auth session:", {
      userId: session?.user?.id,
      email: session?.user?.email,
    });

    if (!session?.user?.id) {
      console.log("No user session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Request body:", body);
    const { listingId, planId, billingCycle, successUrl, cancelUrl, flow, token } = body;

    if (!listingId || !planId || !billingCycle || !successUrl || !cancelUrl) {
      console.log("Missing required parameters:", {
        listingId,
        planId,
        billingCycle,
        successUrl,
        cancelUrl,
      });
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // If a claim token is provided (email-claim flow), verify it matches the listing
    if (token) {
      try {
        const parsed = verifyClaimToken(token);
        if (!parsed || parsed.lid !== listingId) {
          console.warn("Invalid claim token for listingId", { listingId });
          return NextResponse.json({ error: "Invalid claim token" }, { status: 400 });
        }
      } catch (e) {
        console.error("Claim token verification failed", e);
        return NextResponse.json({ error: "Invalid claim token" }, { status: 400 });
      }
    }

    // Handle Founding specials via predefined Price IDs (one-time 6-month special)
    const FOUNDING_STANDARD = process.env.STRIPE_PRICE_FOUNDING_STANDARD;
    const FOUNDING_PRO = process.env.STRIPE_PRICE_FOUNDING_PRO;

    const isFoundingStandard = planId === "founding-standard";
    const isFoundingPro = planId === "founding-pro";
    const isFounding = isFoundingStandard || isFoundingPro;

    let price = 0;
    if (!isFounding) {
      if (!PLAN_PRICES[planId as keyof typeof PLAN_PRICES]) {
        console.log("Invalid plan ID:", planId);
        return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
      }
      price = PLAN_PRICES[planId as keyof typeof PLAN_PRICES][
        billingCycle as keyof typeof PLAN_PRICES.standard
      ];
      if (!price) {
        console.log("Invalid billing cycle:", billingCycle);
        return NextResponse.json(
          { error: "Invalid billing cycle" },
          { status: 400 },
        );
      }
      console.log("Calculated price (cents):", price);
    }

    // Create or retrieve Stripe customer
    let customer;
    try {
      // Try to find existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: session.user.email || "",
        limit: 1,
      });
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        console.log("Using existing customer:", customer.id);
      } else {
        // Create new customer with metadata
        customer = await stripe.customers.create({
          email: session.user.email || "",
          metadata: {
            vendor_id: session.user.id,
            listing_id: listingId,
            plan: planId,
            billing_cycle: billingCycle,
          },
        });
        console.log("Created new customer:", customer.id);
      }
    } catch (error) {
      console.error("Error managing customer:", error);
      return NextResponse.json(
        { error: "Failed to manage customer" },
        { status: 500 },
      );
    }

    console.log("Creating Stripe checkout session...");
    let checkoutSession: Stripe.Checkout.Session;
    if (isFounding) {
      const priceId = isFoundingStandard ? FOUNDING_STANDARD : FOUNDING_PRO;
      if (!priceId) {
        return NextResponse.json(
          { error: "Founding price ID not configured" },
          { status: 500 },
        );
      }
      checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: customer.id,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          vendor_id: session.user.id,
          listing_id: listingId,
          plan: planId,
          billing_cycle: billingCycle,
          ...(flow ? { flow } : {}),
          ...(token ? { claim_token: token } : {}),
        },
      });
    } else {
      checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: customer.id,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan - Claim Listing`,
                description: `Claim and upgrade your business listing with ${planId} plan`,
              },
              unit_amount: price,
              recurring:
                billingCycle === "yearly"
                  ? { interval: "year" }
                  : { interval: "month" },
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
          ...(flow ? { flow } : {}),
          ...(token ? { claim_token: token } : {}),
        },
      });
    }

    console.log("Checkout session created successfully:", checkoutSession.id);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
