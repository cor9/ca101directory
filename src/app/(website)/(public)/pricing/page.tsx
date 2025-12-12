import Container from "@/components/container";
import { FoundingMemberBanner } from "@/components/pricing/founding-member-banner";
import { FoundingPlansSection } from "@/components/pricing/founding-plans-section";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { HeaderSection } from "@/components/shared/header-section";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export const metadata = constructMetadata({
  title: "Pricing Plans - List Your Business | Child Actor 101 Directory",
  description:
    "Compare our Free, Standard, and Pro pricing plans for listing your child actor services. Get more visibility, enhanced features, and priority placement. Simple, transparent pricing with no hidden fees for acting coaches, photographers, and talent reps.",
  canonicalUrl: `${siteConfig.url}/pricing`,
});

export default async function PricingPage() {
  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />
      {/* STEP 1: Page wrapper - kill Bauhaus */}
      <div className="bg-bg-dark min-h-screen">
        <section className="max-w-6xl mx-auto px-4 py-12">
          {/* STEP 2: Pricing header - simple, confident */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-text-primary">
              Simple pricing. Real visibility.
            </h1>
            <p className="mt-3 text-text-secondary max-w-2xl mx-auto">
              List your business where parents are actively searching for trusted child-acting professionals.
            </p>
          </header>

          {/* STEP 3: Pricing grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan Card */}
            <div className="
              relative
              bg-card-surface
              border
              border-border-subtle
              rounded-xl
              p-6
              shadow-card
              transition
            ">
              {/* STEP 5: Plan name + price */}
              <h3 className="text-lg font-semibold text-text-primary">
                Free Plan
              </h3>
              <div className="mt-2 flex items-end gap-1">
                <span className="text-3xl font-bold text-text-primary">
                  $0
                </span>
                <span className="text-sm text-text-muted">
                  / forever
                </span>
              </div>

              {/* STEP 6: Feature list - scannable */}
              <ul className="mt-6 space-y-3">
                <li className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-accent-teal mt-0.5">✓</span>
                  <span>Basic listing information</span>
                </li>
                <li className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-accent-teal mt-0.5">✓</span>
                  <span>Contact details displayed</span>
                </li>
                <li className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-accent-teal mt-0.5">✓</span>
                  <span>Searchable in directory</span>
                </li>
                <li className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-accent-teal mt-0.5">✓</span>
                  <span>Quality review process</span>
                </li>
                <li className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-accent-teal mt-0.5">✓</span>
                  <span>1 logo or thumbnail image</span>
                </li>
              </ul>

              {/* STEP 7: CTA button */}
              <Link
                href="/submit"
                className="
                  mt-6
                  w-full
                  inline-flex
                  items-center
                  justify-center
                  px-4
                  py-2
                  rounded-md
                  text-sm
                  font-medium
                  bg-bg-dark-3
                  text-text-primary
                  border
                  border-border-subtle
                  hover:border-accent-blue
                  transition-colors
                "
              >
                Get Started
              </Link>
            </div>

            {/* Stripe Pricing Table - Standard & Pro Plans */}
            <div className="md:col-span-2">
              <stripe-pricing-table
                pricing-table-id="prctbl_1SCpyNBqTvwy9ZuSNiSGY03P"
                publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
              />
            </div>
          </div>

          {/* Second Stripe Pricing Table - 101 Approved Badge Add-on */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                101 Approved Badge Add-on
              </h2>
              <p className="text-text-secondary">
                Add our trusted badge to your listing
              </p>
            </div>
            <stripe-pricing-table
              pricing-table-id="prctbl_1SCqZVBqTvwy9ZuSqFvjgpqP"
              publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
            />
          </div>

          {/* STEP 9: Trust footer - low key */}
          <p className="mt-10 text-center text-sm text-text-muted">
            Cancel anytime. No contracts. Listings reviewed for quality.
          </p>

          {/* FAQ Section */}
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-text-primary">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <PricingFaq />
            </div>
          </section>
        </section>
      </div>
    </>
  );
}
