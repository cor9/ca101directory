import { auth } from "@/auth";
import { canPurchaseProForListing } from "@/lib/listings/listing-ownership";
import { createServerClient } from "@/lib/supabase";
import { verifyClaimToken } from "@/lib/tokens";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

// Only paid plan: Pro, $399/year, subscription mode.
// Legacy plans (Standard, Founding Standard, Founding Pro) are grandfathered
// for existing subscribers only and must never be purchasable here.
const PRO_ANNUAL_PRICE_ID = process.env.STRIPE_PRICE_ID_PRO_ANNUAL;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Stripe is not configured (missing secret key)" },
        { status: 500 },
      );
    }

    if (!PRO_ANNUAL_PRICE_ID) {
      console.error("STRIPE_PRICE_ID_PRO_ANNUAL is not configured");
      return NextResponse.json(
        { error: "Stripe is not configured (missing Pro price)" },
        { status: 500 },
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, successUrl, cancelUrl, flow, token, repCode } = body;

    if (!listingId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    // successUrl/cancelUrl come from the client and Stripe will redirect the
    // buyer there: only allow our own origins (no open redirect).
    const allowedOrigins = new Set<string>([new URL(request.url).origin]);
    for (const u of [
      process.env.NEXT_PUBLIC_SITE_URL,
      process.env.NEXT_PUBLIC_APP_URL,
    ]) {
      try {
        if (u) allowedOrigins.add(new URL(u).origin);
      } catch {}
    }
    const isOwnUrl = (u: unknown) => {
      try {
        return typeof u === "string" && allowedOrigins.has(new URL(u).origin);
      } catch {
        return false;
      }
    };
    if (!isOwnUrl(successUrl) || !isOwnUrl(cancelUrl)) {
      return NextResponse.json(
        { error: "Invalid redirect URL" },
        { status: 400 },
      );
    }

    // If a claim token is provided (email-claim flow), verify it matches the listing
    let hasValidClaimToken = false;
    if (token) {
      try {
        const parsed = verifyClaimToken(token);
        if (!parsed || parsed.lid !== listingId) {
          console.warn("Invalid claim token for listingId", { listingId });
          return NextResponse.json(
            { error: "Invalid claim token" },
            { status: 400 },
          );
        }
        hasValidClaimToken = true;
      } catch (e) {
        console.error("Claim token verification failed", e);
        return NextResponse.json(
          { error: "Invalid claim token" },
          { status: 400 },
        );
      }
    }

    // SECURITY FIX (independent follow-up audit, Task 2): verify the
    // caller is actually allowed to purchase Pro for THIS listing —
    // either they already own it, or they presented a valid claim token
    // for it above. Without this, any signed-in user could POST an
    // arbitrary listingId with no token at all and pay for a listing
    // that was never theirs — see canPurchaseProForListing's doc comment.
    const supabase = createServerClient();
    const { data: listing, error: listingLookupError } = await supabase
      .from("listings")
      .select("owner_id")
      .eq("id", listingId)
      .single();

    if (listingLookupError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (
      !canPurchaseProForListing({
        listingOwnerId: listing.owner_id,
        currentUserId: session.user.id,
        hasValidClaimToken,
      })
    ) {
      return NextResponse.json(
        {
          error: listing.owner_id
            ? "This listing has already been claimed by another account."
            : "You can only purchase Pro for a listing you own, or one you're claiming with a valid claim link.",
        },
        { status: 403 },
      );
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
        }
      } catch (error) {
        console.warn(
          "Customer lookup failed; proceeding without explicit customer.",
          error,
        );
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      ...(customerId ? { customer: customerId } : {}),
      ...(session.user.email ? { customer_email: session.user.email } : {}),
      line_items: [{ price: PRO_ANNUAL_PRICE_ID, quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: listingId,
      metadata: {
        vendor_id: session.user.id,
        listing_id: listingId,
        plan: "pro",
        ...(flow ? { flow } : {}),
        ...(token ? { claim_token: token } : {}),
        ...(repCode ? { rep_code: repCode } : {}),
      },
    });

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
