import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { createServerClient } from "@/lib/supabase";
import {
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  MailIcon,
  SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export default async function PaymentSuccessPage({
  searchParams,
}: { searchParams: { [key: string]: string | undefined } }) {
  console.log("[Payment Success] Received search params:", searchParams);

  const session = await auth();
  console.log(
    "[Payment Success] User session:",
    session?.user?.id ? "Logged in" : "Not logged in",
  );

  // If Stripe session is present, retrieve checkout details
  const sessionId = searchParams?.session_id;
  let checkoutSession = null as any;
  let listingId = null as string | null;

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-04-10",
      });
      checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });
      console.log("[Payment Success] Checkout session retrieved:", {
        id: checkoutSession.id,
        status: checkoutSession.status,
        payment_status: checkoutSession.payment_status,
        metadata: checkoutSession.metadata,
        client_reference_id: checkoutSession.client_reference_id,
        customer_email: checkoutSession.customer_details?.email,
      });

      listingId =
        checkoutSession.metadata?.listing_id ||
        checkoutSession.client_reference_id;

      // If user is NOT logged in and we have a listing ID, redirect to login with session preserved
      if (!session?.user?.id && listingId) {
        console.log(
          "[Payment Success] User not logged in, redirecting to auth with session preserved",
        );
        const callbackUrl = `/payment-success?session_id=${sessionId}`;
        return redirect(
          `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        );
      }

      // If user IS logged in and has a listing ID: /api/webhook is the
      // source of truth for plan/ownership completion now (fires
      // server-side on checkout.session.completed, independent of whether
      // the customer ever reaches this page). This is UX confirmation only.
      //
      // TEMPORARY FALLBACK: webhook delivery can race the browser redirect,
      // so if fulfillment hasn't landed yet, complete ownership linking
      // here too — idempotent, and uses the authenticated session's own id
      // (never email inference), matching the webhook's own logic. Remove
      // once webhook delivery is verified reliable in production.
      if (session?.user?.id && listingId) {
        const userId = session.user.id;

        try {
          const supabase = createServerClient();
          const { data: listing } = await supabase
            .from("listings")
            .select("owner_id")
            .eq("id", listingId)
            .single();

          if (listing && listing.owner_id !== userId) {
            console.log(
              "[Payment Success] Webhook fulfillment not yet observed, applying fallback ownership write",
            );
            const { error: fallbackError } = await supabase
              .from("listings")
              .update({
                owner_id: userId,
                is_claimed: true,
                pending_claim_email: null,
                stripe_session_id: null,
                updated_at: new Date().toISOString(),
              })
              .eq("id", listingId);

            if (fallbackError) {
              console.error(
                "[Payment Success] Fallback ownership write failed:",
                fallbackError,
              );
            }
          }
        } catch (err) {
          console.error(
            "[Payment Success] Error checking/applying fallback ownership:",
            err,
          );
        }

        console.log("[Payment Success] Redirecting to vendor dashboard");
        return redirect("/dashboard/vendor?upgraded=1");
      }
    } catch (e) {
      console.error("[Payment Success] Error retrieving Stripe session:", e);
      // Fall through to generic success below
    }
  }
  const userId = session?.user?.id || null;
  let hasListing = false;

  if (userId) {
    try {
      const supabase = createServerClient();
      const { data } = await supabase
        .from("listings")
        .select("id")
        .eq("owner_id", userId)
        .limit(1);
      hasListing = !!(data && data.length > 0);
    } catch (e) {
      // Fallback to showing both options if check fails
      hasListing = false;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
        <CheckCircleIcon className="w-8 h-8 text-green-600" />
      </div>

      <div className="space-y-4">
        <h1 className="bauhaus-heading text-3xl text-paper">
          ✅ Payment Received — Your Listing Is In Review
        </h1>

        <div className="bauhaus-body text-lg text-paper max-w-2xl space-y-4">
          <p>
            Thank you for your payment! Your listing has been submitted and is
            now in the review queue.
          </p>
          <p>
            Our team typically approves listings within 72 hours. Once approved,
            you'll receive an email confirmation and your listing will be
            visible in the 101 Directory.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 rounded-lg p-6 border border-brand-blue/20 max-w-2xl">
        <h3 className="bauhaus-heading text-bauhaus-blue mb-4 flex items-center justify-center gap-2">
          <ClockIcon className="w-5 h-5" />
          Next Steps
        </h3>
        <ul className="text-sm text-paper space-y-2 text-left">
          <li className="flex items-start gap-2">
            <MailIcon className="w-4 h-4 mt-0.5 text-brand-blue" />
            <span>Watch your inbox for approval and live link.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircleIcon className="w-4 h-4 mt-0.5 text-brand-blue" />
            <span>
              While you wait, prepare your logo, gallery photos, and any copy
              edits you might want to add.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        {!userId && (
          <Button asChild>
            <Link href="/auth/login" className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              Sign in to finish your listing
            </Link>
          </Button>
        )}
        {userId && !hasListing && (
          <Button asChild>
            <Link href="/submit" className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              Create Your Listing Now
            </Link>
          </Button>
        )}
        {userId && hasListing && (
          <Button asChild>
            <Link href="/dashboard/vendor" className="flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              Go to Your Dashboard
            </Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/directory" className="flex items-center gap-2">
            <SearchIcon className="w-4 h-4" />
            Browse Directory
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <HomeIcon className="w-4 h-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
