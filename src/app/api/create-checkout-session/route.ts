import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { verifyClaimToken } from "@/lib/tokens";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(stripeSecret, {
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
} as const;

const VALID_BILLING_CYCLES = new Set(["monthly", "yearly"]);

export async function POST(request: NextRequest) {
  try {
    if (!stripeSecret) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        {
          error:
            "Stripe is not configured. Please contact support so we can finish your upgrade manually.",
        },
        { status: 500 },
      );
    }

    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      console.log("No user session found");
      return NextResponse.json(
        {
          error:
            "Please sign in to upgrade your listing. You'll be redirected back here once you're logged in.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      listingId,
      planId,
      billingCycle,
      successUrl,
      cancelUrl,
      flow,
      token,
    } = body;

    if (!listingId || !planId || !billingCycle || !successUrl || !cancelUrl) {
      console.log("Missing required parameters", body);
      return NextResponse.json(
        {
          error:
            "Missing checkout details. Refresh the page and try again or contact support if the issue continues.",
        },
        { status: 400 },
      );
    }

    if (!VALID_BILLING_CYCLES.has(billingCycle)) {
      console.warn("Invalid billing cycle", billingCycle);
      return NextResponse.json(
        { error: "Choose monthly or annual billing to continue." },
        { status: 400 },
      );
    }

    if (token) {
      try {
        const parsed = verifyClaimToken(token);
        if (!parsed || parsed.lid !== listingId) {
          console.warn("Invalid claim token for listingId", { listingId });
          return NextResponse.json({ error: "Your claim link is no longer valid." }, { status: 400 });
        }
      } catch (e) {
        console.error("Claim token verification failed", e);
        return NextResponse.json({ error: "Your claim link is no longer valid." }, { status: 400 });
      }
    }

    const supabase = createServerClient();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profileError || !profile) {
      console.error("Profile lookup failed", profileError);
      return NextResponse.json(
        {
          error:
            "We couldn't find your vendor profile. Please contact support so we can verify your account before upgrading.",
        },
        { status: 403 },
      );
    }

    if (profile.role !== "vendor") {
      return NextResponse.json(
        {
          error:
            "Upgrades are only available for vendor accounts. Switch to a vendor profile first from Settings.",
        },
        { status: 403 },
      );
    }

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, owner_id, is_claimed, listing_name, slug")
      .eq("id", listingId)
      .single();

    if (listingError || !listing) {
      console.error("Listing lookup failed", listingError);
      return NextResponse.json(
        {
          error: "We couldn't find that listing. Refresh and try again or reach out to support for help.",
        },
        { status: 404 },
      );
    }

    if (listing.owner_id && listing.owner_id !== session.user.id) {
      console.warn("Listing already owned by another vendor", {
        listingId,
        ownerId: listing.owner_id,
        userId: session.user.id,
      });
      return NextResponse.json(
        {
          error:
            "This listing is already managed by another account. Contact support if you need to transfer ownership.",
        },
        { status: 409 },
      );
    }

    const FOUNDING_STANDARD = process.env.STRIPE_PRICE_FOUNDING_STANDARD;
    const FOUNDING_PRO = process.env.STRIPE_PRICE_FOUNDING_PRO;

    const isFoundingStandard = planId === "founding-standard";
    const isFoundingPro = planId === "founding-pro";
    const isFounding = isFoundingStandard || isFoundingPro;

    let price = 0;
    if (!isFounding) {
      const planPricing = PLAN_PRICES[planId as keyof typeof PLAN_PRICES];
      if (!planPricing) {
        console.warn("Invalid plan ID", planId);
        return NextResponse.json(
          { error: "Please choose a valid plan." },
          { status: 400 },
        );
      }
      price = planPricing[billingCycle as keyof typeof planPricing];
      if (!price) {
        console.warn("Plan missing billing price", { planId, billingCycle });
        return NextResponse.json(
          { error: "Choose monthly or annual billing to continue." },
          { status: 400 },
        );
      }
    }

    let customerId: string | undefined = undefined;
    try {
      const existingCustomers = await stripe.customers.list({
        email: session.user.email,
        limit: 1,
      });
      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      }
    } catch (error) {
      console.warn("Customer lookup failed; continuing", error);
    }

    const metadata: Stripe.MetadataParam = {
      vendor_id: session.user.id,
      listing_id: listingId,
      listing_slug: listing.slug ?? "",
      plan: planId,
      billing_cycle: billingCycle,
      ...(flow ? { flow } : {}),
      ...(token ? { claim_token: token } : {}),
    };

    let checkoutSession: Stripe.Checkout.Session;

    if (isFounding) {
      const priceId = isFoundingStandard ? FOUNDING_STANDARD : FOUNDING_PRO;
      const productName = isFoundingStandard
        ? "Founding Standard (6 months)"
        : "Founding Pro (6 months)";
      const amountCents = isFoundingStandard ? 10100 : 19900;

      checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        client_reference_id: listingId,
        ...(customerId ? { customer: customerId } : {}),
        customer_email: session.user.email,
        line_items: priceId
          ? [{ price: priceId, quantity: 1 }]
          : [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: productName,
                    description: "Founding vendor launch package (6 months)",
                  },
                  unit_amount: amountCents,
                },
                quantity: 1,
              },
            ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        metadata,
      });
    } else {
      checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        client_reference_id: listingId,
        ...(customerId ? { customer: customerId } : {}),
        customer_email: session.user.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan Upgrade`,
                description: "Child Actor 101 Directory vendor subscription",
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
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        metadata,
      });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    const details = {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    };
    console.error("Error creating checkout session:", details);
    return NextResponse.json(
      {
        error:
          "We hit a snag starting checkout. Please refresh and try again. If it keeps happening, email support@childactor101.com with a screenshot of this page.",
        details: details.message,
      },
      { status: 500 },
    );
  }
}
