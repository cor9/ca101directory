import Container from "@/components/container";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { HeaderSection } from "@/components/shared/header-section";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export const metadata = constructMetadata({
  title: "Pricing Plans - Child Actor 101 Directory",
  description:
    "Choose a pricing plan for listing your child actor services. Simple, transparent pricing for professionals.",
  canonicalUrl: `${siteConfig.url}/pricing`,
});

export default async function PricingPage() {
  return (
    <div className="bauhaus">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 via-brand-blue/20 to-brand-yellow/20 rounded-full blur-2xl scale-110" />
                  <div className="relative backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
                    <Image
                      src="/logo.png"
                      alt="Child Actor 101 Directory Logo"
                      width={300}
                      height={150}
                      className="w-auto h-20 mx-auto drop-shadow-lg"
                      priority
                    />
                  </div>
                </div>
              </div>

              <h1 className="bauhaus-heading text-4xl mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="bauhaus-body text-xl text-foreground max-w-3xl mx-auto">
                Choose the perfect plan for your child actor services. All plans
                include our quality review process and trusted directory
                listing.
              </p>
            </div>

            {/* Free Plan Card - Custom (not Stripe) */}
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-surface border border-surface rounded-lg p-8 text-center shadow-lg text-surface">
                <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="">/forever</span>
                </div>
                <p className="text-sm mb-6">
                  Get started with a basic listing - no credit card required!
                </p>
                <ul className="text-left mb-6 space-y-2 text-sm">
                  <li>✓ Basic listing information</li>
                  <li>✓ Contact details displayed</li>
                  <li>✓ Searchable in directory</li>
                  <li>✓ Quality review process</li>
                  <li>✗ No images</li>
                </ul>
                <Link
                  href="/submit"
                  className="inline-block w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
                <p className="text-gray-900">
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
                <h2 className="text-2xl font-bold text-brand-orange mb-2">
                  🏆 101 Approved Badge Add-on
                </h2>
                <p className="text-gray-900">
                  Add our trusted badge to your listing
                </p>
              </div>
              <stripe-pricing-table
                pricing-table-id="prctbl_1SCqZVBqTvwy9ZuSqFvjgpqP"
                publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
              />
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-900 leading-normal">
                All plans include our{" "}
                <span className="font-semibold">quality review process</span>{" "}
                and trusted directory listing.
                <br />
                Need help choosing?{" "}
                <a
                  href="mailto:hello@childactor101.com"
                  className="text-brand-blue hover:text-brand-blue-dark font-semibold"
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
    </div>
  );
}
