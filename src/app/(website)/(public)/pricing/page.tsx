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
      <Container className="mt-8 pb-16">
        <div className="w-full flex flex-col gap-16">
          <section className="w-full flex flex-col gap-8 justify-center">
            <div className="text-center mb-12">
              {/* Prominent Logo */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/20 via-secondary-denim/20 to-highlight/20 rounded-full blur-2xl scale-110" />
                  <div className="relative backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
                    <Image
                      src="/directorylogo.png"
                      alt="Child Actor 101 Directory Logo"
                      width={300}
                      height={150}
                      className="w-auto h-20 mx-auto drop-shadow-lg"
                      priority
                    />
                  </div>
                </div>
              </div>

              <h1 className="bauhaus-heading text-4xl text-paper mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="bauhaus-body text-xl text-paper max-w-3xl mx-auto">
                Choose the perfect plan for your child actor services. All plans
                include our quality review process and trusted directory
                listing.
              </p>
            </div>

            {/* Free Plan Card - Custom (not Stripe) */}
            <div className="max-w-md mx-auto mb-8">
              <div className="bauhaus-card bg-surface border-2 border-secondary-denim rounded-lg p-8 text-center shadow-lg">
                <h2 className="bauhaus-heading text-2xl font-bold mb-2">
                  Free Plan
                </h2>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="bauhaus-body text-surface">/forever</span>
                </div>
                <p className="bauhaus-body text-sm text-surface mb-6">
                  Get started with a basic listing - no credit card required!
                </p>
                <ul className="text-left mb-6 space-y-2 text-sm text-surface">
                  <li>✓ Basic listing information</li>
                  <li>✓ Contact details displayed</li>
                  <li>✓ Searchable in directory</li>
                  <li>✓ Quality review process</li>
                  <li>✓ 1 logo or thumbnail image</li>
                  <li>✓ Age tags</li>
                  <li>✓ Services metadata</li>
                </ul>
                <Link
                  href="/submit"
                  className="bauhaus-btn-secondary inline-block w-full font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Start Free Listing →
                </Link>
              </div>
            </div>

            {/* First Stripe Pricing Table - Standard & Pro Plans */}
            <div className="w-full mx-auto">
              <div className="text-center mb-8">
                <h2 className="bauhaus-heading text-2xl text-bauhaus-blue mb-2">
                  Standard & Pro Plans
                </h2>
                <p className="bauhaus-body text-paper">
                  Monthly and annual billing options
                </p>
              </div>
              <stripe-pricing-table
                pricing-table-id="prctbl_1SCpyNBqTvwy9ZuSNiSGY03P"
                publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
              />
            </div>

            {/* Second Stripe Pricing Table - 101 Approved Badge Add-on */}
            <div className="w-full mx-auto mt-12">
              <div className="text-center mb-8">
                <h2 className="bauhaus-heading text-2xl font-bold text-primary-orange mb-2">
                  🏆 101 Approved Badge Add-on
                </h2>
                <p className="bauhaus-body text-paper">
                  Add our trusted badge to your listing
                </p>
              </div>
              <stripe-pricing-table
                pricing-table-id="prctbl_1SCqZVBqTvwy9ZuSqFvjgpqP"
                publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
              />
            </div>

            <div className="text-center mt-8">
              <p className="bauhaus-body text-sm text-paper leading-normal">
                All plans include our{" "}
                <span className="font-semibold">quality review process</span>{" "}
                and trusted directory listing.
                <br />
                Need help choosing?{" "}
                <a
                  href="mailto:hello@childactor101.com"
                  className="text-secondary-denim hover:text-bauhaus-blue font-semibold link-underline"
                >
                  Contact us
                </a>{" "}
                for personalized recommendations.
              </p>
            </div>
          </section>

          <section className="w-full flex flex-col gap-8 justify-center">
            <HeaderSection
              label="FAQ"
              titleAs="h2"
              title="Frequently Asked Questions"
            />

            <div className="w-full max-w-4xl mx-auto">
              <PricingFaq />
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}
