import Container from "@/components/container";
import { PlanSelectionCards } from "@/components/pricing/plan-selection-cards";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { HeaderSection } from "@/components/shared/header-section";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";

export const metadata = constructMetadata({
  title: "Pricing Plans - Child Actor 101 Directory",
  description:
    "Choose a pricing plan for listing your child actor services. Simple, transparent pricing for professionals.",
  canonicalUrl: `${siteConfig.url}/pricing`,
});

export default async function PricingPage() {
  return (
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
            <p className="bauhaus-body text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your child actor services. All plans
              include our quality review process and trusted directory listing.
            </p>
          </div>

          {/* Plan Selection Cards */}
          <PlanSelectionCards />
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
  );
}
