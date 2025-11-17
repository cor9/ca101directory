import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { createServerClient } from "@/lib/supabase";
import {
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  MailIcon,
  SearchIcon,
  ShieldAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";

type ListingSnapshot = {
  id: string;
  listing_name: string | null;
  owner_id: string | null;
  status: string | null;
  plan: string | null;
  slug: string | null;
  updated_at: string | null;
};

const stripeSecret = process.env.STRIPE_SECRET_KEY;

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const authSession = await auth();
  const userId = authSession?.user?.id || null;

  const sessionId = searchParams?.session_id;
  const flow = searchParams?.flow;

  if (sessionId && !userId) {
    const callbackUrl = `/payment-success?session_id=${encodeURIComponent(sessionId)}${flow ? `&flow=${encodeURIComponent(flow)}` : ""}`;
    return redirect(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  let checkoutSession: Stripe.Checkout.Session | null = null;
  let listingId: string | null = null;
  let planFromMetadata: string | null = null;
  let amountPaid = 0;

  if (sessionId && stripeSecret) {
    try {
      const stripe = new Stripe(stripeSecret, { apiVersion: "2024-04-10" });
      checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
      });

      listingId =
        (typeof checkoutSession.metadata?.listing_id === "string"
          ? checkoutSession.metadata?.listing_id
          : null) || checkoutSession.client_reference_id || null;
      planFromMetadata =
        typeof checkoutSession.metadata?.plan === "string"
          ? checkoutSession.metadata.plan
          : null;
      amountPaid = typeof checkoutSession.amount_total === "number" ? checkoutSession.amount_total / 100 : 0;
    } catch (error) {
      console.error("[Payment Success] Unable to retrieve Stripe session", error);
    }
  }

  const supabase = createServerClient();
  let listing: ListingSnapshot | null = null;

  if (listingId) {
    try {
      const { data } = await supabase
        .from("listings")
        .select("id, listing_name, owner_id, status, plan, slug, updated_at")
        .eq("id", listingId)
        .single();
      listing = (data as ListingSnapshot) || null;
    } catch (error) {
      console.warn("[Payment Success] Could not load listing", error);
    }
  }

  const listingName = listing?.listing_name || "your listing";
  const planLabel = (planFromMetadata || listing?.plan || "Standard")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const isLinkedToUser = Boolean(listing && userId && listing.owner_id === userId);
  const isPublished = Boolean(
    listing?.status && ["published", "live"].includes(listing.status.toLowerCase()),
  );

  const steps: Array<{
    title: string;
    description: string;
    done: boolean;
  }> = [
    {
      title: "Payment received",
      description:
        amountPaid > 0
          ? `Stripe confirmed your ${planLabel} plan payment for $${amountPaid.toFixed(2)}.`
          : "Stripe confirmed your plan payment.",
      done: Boolean(checkoutSession),
    },
    {
      title: "Listing connected",
      description: isLinkedToUser
        ? `${listingName} is now attached to your account. You'll manage everything from the vendor dashboard.`
        : "We're finishing the hand-off. If this stays pending for more than a few minutes, contact support and we'll take care of it for you.",
      done: isLinkedToUser,
    },
    {
      title: "Directory review",
      description: isPublished
        ? "Your upgraded listing is live. Keep an eye on the dashboard for analytics."
        : "Our editorial team is reviewing your updates. Expect an email within 72 hours once everything goes live.",
      done: isPublished,
    },
  ];

  const ctaButtons = (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      {userId ? (
        <Button asChild>
          <Link href="/dashboard/vendor" className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            Open Vendor Dashboard
          </Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href="/auth/login" className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            Sign in to finish setup
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
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
        <CheckCircleIcon className="w-8 h-8 text-green-600" />
      </div>

      <div className="space-y-3 max-w-2xl">
        <h1 className="bauhaus-heading text-3xl text-paper">
          Payment received — you're in the review queue
        </h1>
        <p className="bauhaus-body text-lg text-paper">
          Thanks for upgrading! We automatically linked your payment to {listingName} so you never have to chase support or update Supabase rows by hand.
        </p>
      </div>

      <div className="w-full max-w-3xl space-y-4">
        {steps.map((step) => (
          <div
            key={step.title}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border p-4 text-left ${step.done ? "border-green-200 bg-green-50" : "border-brand-blue/30 bg-white"}`}
          >
            <div className="flex items-start gap-3">
              {step.done ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <ClockIcon className="w-5 h-5 text-brand-blue mt-0.5" />
              )}
              <div>
                <h3 className="bauhaus-heading text-lg text-paper">{step.title}</h3>
                <p className="text-sm text-paper leading-relaxed">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isLinkedToUser && listingId && (
        <div className="max-w-3xl rounded-lg border border-brand-orange/40 bg-brand-orange/10 p-4 text-left">
          <div className="flex items-start gap-3">
            <ShieldAlertIcon className="w-5 h-5 text-brand-orange mt-0.5" />
            <div className="space-y-1">
              <h3 className="bauhaus-heading text-lg text-brand-orange">
                Still syncing your account
              </h3>
              <p className="text-sm text-paper">
                It usually takes less than a minute for Stripe to finish updating Supabase. If you don't see the listing in your dashboard after a quick refresh, forward your receipt to
                <span className="font-medium"> support@childactor101.com</span> and we'll attach it manually.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-6 text-left space-y-3">
        <h2 className="bauhaus-heading text-xl text-bauhaus-blue flex items-center gap-2">
          <MailIcon className="w-5 h-5" />
          What's next
        </h2>
        <ul className="space-y-2 text-sm text-paper">
          <li>
            • You'll receive a Stripe receipt at {checkoutSession?.customer_details?.email || "your account email"} and a separate "in review" message from our team.
          </li>
          <li>• Need edits while we review? Jump into the vendor dashboard and make changes—we keep the same claim in place.</li>
          <li>• Want faster approval? Add your logo, gallery images, and standout copy right away so reviewers have everything they need.</li>
        </ul>
      </div>

      {ctaButtons}
    </div>
  );
}
