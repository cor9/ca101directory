import { CheckCircle, Shield, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Claim Your Listing - Child Actor 101 Vendor Directory",
  description:
    "Learn how to claim and manage your listing in the Child Actor 101 Vendor Directory.",
};

const steps = [
  {
    title: "Find your listing",
    body: "Search the directory to find your company or professional listing.",
  },
  {
    title: "Select “Claim This Listing”",
    body: "On your listing page, use the claim button.",
  },
  {
    title: "Submit your claim",
    body: "Provide proof that you represent the company or professional.",
  },
  {
    title: "Get approved",
    body: "Our team reviews and approves your claim.",
  },
];

const benefits = [
  {
    Icon: Shield,
    title: "Full control",
    body: "Update your information, photos, media and services.",
  },
  {
    Icon: Users,
    title: "Respond to reviews",
    body: "Engage with families and build your reputation.",
  },
  {
    Icon: CheckCircle,
    title: "Verified Business badge",
    body: "Show families that ownership of this listing has been verified.",
  },
];

export default function ClaimListingPage() {
  return (
    <div>
      <header className="surface-hero">
        <div className="mx-auto max-w-5xl px-5 pb-16 pt-14 sm:px-8 md:pb-20 md:pt-20">
          <p className="eyebrow">Claim a listing</p>
          <h1 className="heading-display mt-4 text-4xl text-white md:text-6xl">
            Take control of your listing
          </h1>
          <p className="mt-5 max-w-2xl text-lg !text-zinc-300">
            Represent this company or professional? Claim your listing to
            update information, add photos and media, and manage your Directory
            presence.
          </p>
        </div>
      </header>

      <section className="surface-canvas">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="heading-display mt-3 text-3xl text-ink">
              Four simple steps
            </h2>
            <ol className="mt-8 space-y-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-brass"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{s.title}</h3>
                    <p className="mt-0.5 text-sm !text-ink-soft">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-canvas-line bg-white p-7 shadow-[0_24px_48px_-30px_rgba(18,22,29,0.4)]">
            <p className="eyebrow">Benefits</p>
            <h2 className="heading-display mt-3 text-3xl text-ink">
              What you get
            </h2>
            <ul className="mt-6 space-y-5">
              {benefits.map(({ Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brass-tint text-brass-dark">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">{title}</h3>
                    <p className="mt-0.5 text-sm !text-ink-soft">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-canvas-line pt-6">
              <h3 className="font-semibold text-ink">Requirements</h3>
              <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                <li>• A free account</li>
                <li>• Email verification</li>
                <li>• A business or professional email address</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-navy">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <h2 className="heading-display text-3xl text-white md:text-4xl">
            Ready to claim your listing?
          </h2>
          <p className="mt-4 !text-zinc-300">
            Search the directory to find your listing and start the claim
            process.
          </p>
          <Link href="/directory" className="btn-brass focus-ring mt-8">
            Browse the Directory
          </Link>
        </div>
      </section>
    </div>
  );
}
