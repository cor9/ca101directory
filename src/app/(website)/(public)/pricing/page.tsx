import Container from "@/components/container";
import { PricingPlans } from "@/components/dashboard/pricing-plans";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { HeaderSection } from "@/components/shared/header-section";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Pricing",
  description: "Choose a pricing plan for submitting your product",
  canonicalUrl: `${siteConfig.url}/pricing`,
});

export default async function PricingPage() {
  return (
    <Container className="mt-8 pb-16">
      <div className="w-full flex flex-col gap-16">
        <section className="w-full flex flex-col gap-8 justify-center">
          <HeaderSection
            labelAs="h1"
            label="Pricing"
            titleAs="h2"
            title="Choose a pricing plan"
          />

          <div className="w-full max-w-4xl mx-auto">
            <PricingPlans />
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
  );
}
