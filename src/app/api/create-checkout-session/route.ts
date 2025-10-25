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
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Stripe is not configured (missing secret key)" },
        { status: 500 },
      );
    }
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

    // Optional: look up an existing customer by email, but do not fail if not found.
    // Checkout can create a customer implicitly using customer_email.
    let customerId: string | undefined = undefined;
    if (session.user.email) {
      try {
        const existingCustomers = await stripe.customers.list({
          email: session.user.email,
          limit: 1,
        });
        if (existingCustomers.data.length > 0) {
          customerId = existingCustomers.data[0].id;
          console.log("Using existing customer:", customerId);
        }
      } catch (error) {
        console.warn("Customer lookup failed; proceeding without explicit customer.", error);
      }
    }

    console.log("Creating Stripe checkout session...");
    let checkoutSession: Stripe.Checkout.Session;
    if (isFounding) {
      const priceId = isFoundingStandard ? FOUNDING_STANDARD : FOUNDING_PRO;
      const productName = isFoundingStandard ? "Founding Standard (6 months)" : "Founding Pro (6 months)";
      const amountCents = isFoundingStandard ? 10100 : 19900;

      // Prefer configured Stripe Price IDs; otherwise fall back to inline price_data
      checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        ...(customerId ? { customer: customerId } : {}),
        ...(session.user.email ? { customer_email: session.user.email } : {}),
        line_items: priceId
          ? [{ price: priceId, quantity: 1 }]
          : [{
              price_data: {
                currency: "usd",
                product_data: { name: productName, description: "Founding vendor special (6 months)" },
                unit_amount: amountCents,
              },
              quantity: 1,
            }],
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
        ...(customerId ? { customer: customerId } : {}),
        ...(session.user.email ? { customer_email: session.user.email } : {}),
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
    const details = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    };
    console.error("Error creating checkout session:", details);
    return NextResponse.json(
      { error: details.message || "Internal server error" },
      { status: 500 },
    );
  }
}
