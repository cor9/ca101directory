import Container from "@/components/container";
import { FreePlanCard } from "@/components/pricing/free-plan-card";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { HeaderSection } from "@/components/shared/header-section";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";
import Script from "next/script";

export const metadata = constructMetadata({
  title: "Pricing Plans - Child Actor 101 Directory",
  description:
    "Choose a pricing plan for listing your child actor services. Simple, transparent pricing for professionals.",
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
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/20 via-brand-blue/20 to-brand-yellow/20 rounded-full blur-2xl scale-110" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
                    <Image
                      src="/images/logo.png"
                      alt="Child Actor 101 Directory Logo"
                      width={300}
                      height={150}
                      className="w-auto h-20 mx-auto drop-shadow-lg"
                      priority
                    />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose the perfect plan for your child actor services. All plans
                include our quality review process and trusted directory
                listing.
              </p>
            </div>

            {/* Free Plan */}
            <div className="w-full mx-auto mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-blue mb-2">
                  🆓 Free Forever Plan
                </h2>
                <p className="text-muted-foreground">
                  Start with our free plan - no payment required
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <FreePlanCard />
              </div>
            </div>

            {/* Founding Vendor Bundles */}
            <div className="w-full mx-auto mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-orange mb-2">
                  🎉 Founding Vendor Bundles
                </h2>
                <p className="text-muted-foreground">
                  Limited time offers for early adopters
                </p>
              </div>
              <stripe-pricing-table
                pricing-table-id="prctbl_1SCBmdBqTvwy9ZuSiH2AP9j2"
                publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
              />
            </div>

            {/* Annual Plans */}
            <div className="w-full mx-auto mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-blue mb-2">
                  💰 Annual Plans
                </h2>
                <p className="text-muted-foreground">
                  Save 2 months with annual billing
                </p>
              </div>
              <stripe-pricing-table
                pricing-table-id="prctbl_1SCBrkBqTvwy9ZuSjRImYrdl"
                publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
              />
            </div>

            {/* Monthly Plans */}
            <div className="w-full mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-blue mb-2">
                  📅 Monthly Plans
                </h2>
                <p className="text-muted-foreground">
                  Flexible monthly billing
                </p>
              </div>
              <stripe-pricing-table
                pricing-table-id="prctbl_1SCBtjBqTvwy9ZuSiybkeqGE"
                publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
              />
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground leading-normal">
                All plans include our{" "}
                <span className="font-semibold">quality review process</span>{" "}
                and trusted directory listing.
                <br />
                Need help choosing?{" "}
                <a
                  href="mailto:corey@childactor101.com"
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
    </>
  );
}
