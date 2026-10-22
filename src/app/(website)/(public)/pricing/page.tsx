import { auth } from "@/auth";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { siteConfig } from "@/config/site";
import { getVendorListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Pricing Plans - Add Your Listing | Child Actor 101 Vendor Directory",
  description:
    "Choose between a Free Listing or a Pro Listing for $399/year. Get real visibility in the Child Actor 101 Vendor Directory with simple annual pricing.",
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
    <div className="bg-canvas-2">
      <header className="surface-hero">
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-14 text-center md:pb-28 md:pt-20">
          <p className="eyebrow">Pricing</p>
          <h1 className="heading-display mt-4 text-4xl text-white md:text-6xl">
            Free to start. Pro when you want more reach.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg !text-zinc-300">
            List your services where parents are actively searching for
            child-acting professionals. Start with a Free Listing or go straight
            to Pro for stronger visibility.
          </p>
        </div>
      </header>

      <div className="surface-canvas flow-root">
      <section className="mx-auto max-w-5xl px-4 pb-16 md:pb-20">
        <div className="-mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          <section className="rounded-2xl border border-canvas-line bg-white p-6 shadow-[0_24px_48px_-28px_rgba(18,22,29,0.45)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="heading-display text-3xl text-zinc-900">
                  Free Listing
                </h2>
                <p className="mt-2 text-sm text-zinc-700">
                  A solid starting point for getting your business into the
                  directory.
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-zinc-900">$0</div>
                <div className="text-sm text-zinc-500">forever</div>
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {freeFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-sm text-zinc-700"
                >
                  <span className="mt-0.5 text-brass-dark">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/submit"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-ink/30 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:border-brass-dark"
            >
              Start Free Listing
            </Link>
          </section>

          <section className="relative rounded-2xl border-2 border-brass bg-white p-6 shadow-[0_24px_48px_-28px_rgba(18,22,29,0.45)] md:p-8">
            <div className="absolute right-6 top-6 rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Pro
            </div>

            <div className="pr-16">
              <h2 className="heading-display text-3xl text-zinc-900">
                Pro Listing
              </h2>
              <p className="mt-2 text-sm text-zinc-700">
                Built for vendors who want premium placement, more exposure, and
                a stronger directory presence.
              </p>
            </div>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-4xl font-bold text-zinc-900">$399</span>
              <span className="pb-1 text-sm text-zinc-500">/ year</span>
            </div>
            <p className="mt-2 text-sm text-zinc-700">
              One annual plan. No monthly toggle. No legacy tiers.
            </p>

            <ul className="mt-8 space-y-3">
              {proFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-sm text-zinc-700"
                >
                  <span className="mt-0.5 text-brass-dark">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={proHref}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-2"
            >
              {existingListingId
                ? "Checkout Pro Listing"
                : "Get Started with Pro"}
            </Link>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-ink-soft">
          Cancel anytime. No contracts. Listings reviewed for quality.
        </p>

      </section>
      </div>

      <section className="surface-canvas-2">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="mb-8 text-center">
            <p className="eyebrow">Questions</p>
            <h2 className="heading-display mt-3 text-3xl text-ink">
              Frequently asked questions
            </h2>
          </div>
          <PricingFaq />
        </div>
      </section>
    </div>
  );
}
