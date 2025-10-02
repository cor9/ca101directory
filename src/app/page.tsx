import { BlogSection } from "@/components/blog/blog-section";
import { CollectionsSection } from "@/components/collections/collections-section";
import Container from "@/components/container";
import HomeCategoryGrid from "@/components/home/home-category-grid";
import HomeFeaturedListings from "@/components/home/home-featured-listings";
import HomeHero from "@/components/home/home-hero";
import HomeHowItWorks from "@/components/home/home-how-it-works";
import HomeParentCta from "@/components/home/home-parent-cta";
import HomePricingPreview from "@/components/home/home-pricing-preview";
import HomeValueProps from "@/components/home/home-value-props";
import HomeVendorCta from "@/components/home/home-vendor-cta";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import Script from "next/script";
import { Suspense } from "react";

export const metadata = constructMetadata({
  title: "Child Actor 101 Directory - Find Trusted Acting Professionals",
  description:
    "Find trusted acting coaches, photographers, agents, and other professionals for your child's acting career",
  canonicalUrl: `${siteConfig.url}/`,
});

export default function HomePage() {
  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />

      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <Container className="mt-8 mb-20">
          <HomeHero />
        </Container>

        {/* Value Props Section */}
        <HomeValueProps />

        {/* How It Works Section */}
        <Container className="py-16">
          <HomeHowItWorks />
        </Container>

        {/* Category Grid Section */}
        <Container className="py-16">
          <HomeCategoryGrid />
        </Container>

        {/* Parent CTA Section */}
        <Container className="py-16">
          <HomeParentCta />
        </Container>

        {/* Featured Listings Section */}
        <Container className="py-16">
          <HomeFeaturedListings />
        </Container>

        {/* Sample Professionals Section */}
        <Container className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Sample Professionals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our complete directory of vetted child actor professionals.
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <a
                href="/directory"
                className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors"
              >
                Browse All
              </a>
              <a
                href="/category"
                className="px-6 py-3 border border-brand-orange text-brand-orange rounded-lg hover:bg-brand-orange/10 transition-colors"
              >
                Browse by Category
              </a>
            </div>
          </div>
        </Container>

        {/* Vendor CTA Section */}
        <Container className="py-16">
          <HomeVendorCta />
        </Container>

        {/* Pricing Preview Section */}
        <Container className="py-16">
          <HomePricingPreview />
        </Container>

        {/* Collections Section */}
        <Container className="py-16">
          <Suspense fallback={
            <div className="text-center py-16">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4" />
                <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted rounded" />
                  ))}
                </div>
              </div>
            </div>
          }>
            <CollectionsSection />
          </Suspense>
        </Container>

        {/* Blog Section */}
        <Container className="py-16">
          <Suspense fallback={
            <div className="text-center py-16">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4" />
                <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-muted rounded" />
                  ))}
                </div>
              </div>
            </div>
          }>
            <BlogSection />
          </Suspense>
        </Container>

        {/* Newsletter Section */}
        <Container className="py-16">
          <NewsletterCard />
        </Container>
      </div>
    </>
  );
}
