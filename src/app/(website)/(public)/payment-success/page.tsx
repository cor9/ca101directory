import { Button } from "@/components/ui/button";
import { createServerClient } from "@/lib/supabase";
import { auth } from "@/auth";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { CheckCircleIcon, ClockIcon, HomeIcon, MailIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

export default async function PaymentSuccessPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  console.log("[Payment Success] Received search params:", searchParams);
  
  // Fast-path fallback: if flow and lid are present in URL, route immediately
  if (searchParams?.flow === "claim_upgrade" && searchParams?.lid) {
    console.log("[Payment Success] Redirecting to enhance page for claim_upgrade flow");
    return redirect(`/dashboard/vendor/listing/${encodeURIComponent(searchParams.lid)}/enhance?upgraded=1`);
  }
  
  // If Stripe session is present, route based on metadata
  const sessionId = searchParams?.session_id;
  console.log("[Payment Success] Session ID:", sessionId);
  
  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
      const checkout = await stripe.checkout.sessions.retrieve(sessionId);
      console.log("[Payment Success] Checkout session retrieved:", {
        id: checkout.id,
        status: checkout.status,
        payment_status: checkout.payment_status,
        metadata: checkout.metadata,
        client_reference_id: checkout.client_reference_id,
      });
      
      const flow = checkout.metadata?.flow;
      const listingId = checkout.metadata?.listing_id || checkout.client_reference_id;
      
      if (flow === "claim_upgrade" && listingId) {
        console.log("[Payment Success] Redirecting to enhance page");
        redirect(`/dashboard/vendor/listing/${listingId}/enhance?upgraded=1`);
      }
    } catch (e) {
      console.error("[Payment Success] Error retrieving Stripe session:", e);
      // Fall through to generic success below
    }
  }
  const session = await auth();
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
