import { auth } from "@/auth";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { siteConfig } from "@/config/site";
import { getVendorListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Pricing Plans - List Your Business | Child Actor 101 Directory",
  description:
    "Choose between a Free Listing or a Pro Listing for $399/year. Get real visibility in the Child Actor 101 Directory with simple annual pricing.",
  canonicalUrl: `${siteConfig.url}/pricing`,
});

const freeFeatures = [
  "Basic listing information",
  "Contact details displayed",
  "Searchable in directory",
  "1 active event posting",
  "Quality review process",
  "1 logo or thumbnail image",
];

const proFeatures = [
  "Everything in Free Listing",
  "Featured placement and stronger visibility",
  "Enhanced profile presentation",
  "Unlimited active event postings",
  "Priority support",
  "Advanced promotional value for established vendors",
];

export default async function PricingPage() {
  const session = await auth();
  let existingListingId: string | null = null;
  if (session?.user?.id) {
    const listings = await getVendorListings(session.user.id);
    existingListingId = listings[0]?.id ?? null;
  }

  // Route the Pro CTA through the in-app checkout flow so the purchase
  // carries listing attribution. A visitor with an existing listing goes
  // straight to checkout; anyone else creates/claims a listing first, then
  // upgrades from their dashboard — same path every Free vendor already uses.
  const proHref = existingListingId
    ? `/plan-selection?listingId=${existingListingId}`
    : "/submit";

  return (
    <div className="min-h-screen bg-bg-dark">
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-teal">
            Pricing
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-text-primary md:text-5xl">
            Free to start. Pro when you want more reach.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary md:text-lg">
            List your business where parents are actively searching for trusted
            child-acting professionals. Start with a Free Listing or go straight
            to Pro for stronger visibility.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <section className="rounded-2xl border border-border-subtle bg-card-surface p-6 shadow-card md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-text-primary">
                  Free Listing
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  A solid starting point for getting your business into the
                  directory.
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-text-primary">$0</div>
                <div className="text-sm text-text-muted">forever</div>
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-sm text-text-secondary"
                >
                  <span className="mt-0.5 text-accent-teal">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/submit"
              className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-border-subtle bg-bg-dark-3 px-4 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent-blue"
            >
              Start Free Listing
            </Link>
          </section>

          <section className="relative rounded-2xl border border-accent-blue/40 bg-card-surface p-6 shadow-card md:p-8">
            <div className="absolute right-6 top-6 rounded-full bg-accent-blue/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-blue">
              Pro
            </div>

            <div className="pr-16">
              <h2 className="text-2xl font-semibold text-text-primary">
                Pro Listing
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Built for vendors who want premium placement, more exposure, and
                a stronger directory presence.
              </p>
            </div>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-bold text-text-primary">$399</span>
              <span className="pb-1 text-sm text-text-muted">/ year</span>
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              One annual plan. No monthly toggle. No legacy tiers.
            </p>

            <ul className="mt-8 space-y-3">
              {proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-sm text-text-secondary"
                >
                  <span className="mt-0.5 text-accent-blue">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={proHref}
              className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-accent-blue px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/90"
            >
              {existingListingId
                ? "Checkout Pro Listing"
                : "Get Started with Pro"}
            </Link>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-text-muted">
          Cancel anytime. No contracts. Listings reviewed for quality.
        </p>

        <section className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-text-primary">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mx-auto max-w-4xl">
            <PricingFaq />
          </div>
        </section>
      </section>
    </div>
  );
}
