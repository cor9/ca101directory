import Container from "@/components/container";
import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import VendorHero from "@/components/vendor/vendor-hero";
import VendorValueProps from "@/components/vendor/vendor-value-props";
import VendorPricing from "@/components/vendor/vendor-pricing";
import VendorTestimonials from "@/components/vendor/vendor-testimonials";
import VendorFAQ from "@/components/vendor/vendor-faq";
import VendorFinalCta from "@/components/vendor/vendor-final-cta";

export const metadata = constructMetadata({
  title: "List Your Business - Child Actor 101 Directory",
  description:
    "Get discovered by thousands of families looking for acting professionals. Join the #1 directory for child actor vendors & industry pros.",
  canonicalUrl: `${siteConfig.url}/list-your-business`,
});

export default function VendorLandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 1. Hero (Vendor-Facing) */}
      <Container className="mt-8 mb-20">
        <VendorHero />
      </Container>

      {/* 2. Why List With Us */}
      <VendorValueProps />

      {/* 3. Pricing Plans */}
      <Container className="py-16">
        <VendorPricing />
      </Container>

      {/* 4. Social Proof */}
      <Container className="py-16">
        <VendorTestimonials />
      </Container>

      {/* 5. FAQ */}
      <VendorFAQ />

      {/* 6. Final CTA Banner */}
      <Container className="py-16">
        <VendorFinalCta />
      </Container>
    </div>
  );
}
