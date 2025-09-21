import Container from "@/components/container";
import { PricingPlans } from "@/components/dashboard/pricing-plans";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { HeaderSection } from "@/components/shared/header-section";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

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
            <h1 className="text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your child actor services. All plans
              include our quality review process and trusted directory listing.
            </p>
          </div>

          <div className="w-full mx-auto">
            <PricingPlans />
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground leading-normal">
              All plans include our{" "}
              <span className="font-semibold">quality review process</span> and
              trusted directory listing.
              <br />
              Need help choosing?{" "}
              <a
                href="mailto:corey@childactor101.com"
                className="text-blue-600 hover:text-blue-700 font-semibold"
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
  );
}
