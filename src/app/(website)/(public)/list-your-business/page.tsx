import Container from "@/components/container";
import VendorFAQ from "@/components/vendor/vendor-faq";
import VendorFinalCta from "@/components/vendor/vendor-final-cta";
import VendorHero from "@/components/vendor/vendor-hero";
import VendorPricing from "@/components/vendor/vendor-pricing";
import VendorValueProps from "@/components/vendor/vendor-value-props";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "List Your Business - Child Actor 101 Directory",
  description:
    "Get discovered by thousands of families looking for acting professionals. Join the #1 directory for child actor vendors & industry pros.",
  canonicalUrl: `${siteConfig.url}/list-your-business`,
});

export default function VendorLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--navy)] bg-[radial-gradient(1200px_600px_at_70%_-10%,#122338,transparent)]">
      {/* 1. Hero (Vendor-Facing) */}
      <Container className="mt-8 mb-20">
        <VendorHero />
      </Container>

      {/* 2. Why List With Us */}
      <section className="bg-[color:var(--navy)] py-16">
        <VendorValueProps />
      </section>

      {/* 3. Pricing Plans */}
      <section className="bg-[color:var(--navy)] py-16">
        <Container>
          <VendorPricing />
        </Container>
      </section>

      {/* 4. FAQ */}
      <section className="bg-[color:var(--navy)]">
        <VendorFAQ />
      </section>

      {/* 5. Final CTA Banner */}
      <section className="bg-[color:var(--navy)] py-16">
        <Container>
          <VendorFinalCta />
        </Container>
      </section>
    </div>
  );
}
