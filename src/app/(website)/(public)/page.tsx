import Container from "@/components/container";
import { DirectoryFilters } from "@/components/directory/directory-filters";
import HomeFAQ from "@/components/home/home-faq";
import HomeFeaturedListings from "@/components/home/home-featured-listings";
import HomeHero from "@/components/home/home-hero";
import HomeHowItWorks from "@/components/home/home-how-it-works";
import HomeParentCta from "@/components/home/home-parent-cta";
import HomePricingPreview from "@/components/home/home-pricing-preview";
import HomeValueProps from "@/components/home/home-value-props";
import HomeVendorCta from "@/components/home/home-vendor-cta";
import ItemGrid from "@/components/item/item-grid";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import SearchBox from "@/components/search/search-box";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
import { DEFAULT_SORT, ITEMS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import Script from "next/script";

export const metadata = constructMetadata({
  title: "Child Actor 101 Directory - Find Trusted Acting Professionals",
  description:
    "Find trusted acting coaches, photographers, agents, and other professionals for your child's acting career",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function HomePage() {
  // Fetch categories for filters
  let categories = [];
  try {
    categories = await getCategories();
    console.log("Homepage: Fetched categories:", categories.length, categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Fetch first few listings for homepage preview
  let items = [];
  let totalCount = 0;
  try {
    const result = await getItems({
      sortKey: DEFAULT_SORT.sortKey,
      reverse: DEFAULT_SORT.reverse,
      currentPage: 1,
      hasSponsorItem: false,
    });
    items = result.items;
    totalCount = result.totalCount;
  } catch (error) {
    console.error("Error fetching items:", error);
  }

  // Show only first 6 items on homepage
  const previewItems = items.slice(0, 6);

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />

      <div className="flex min-h-screen flex-col">
        {/* 1. Hero Section */}
        <Container className="mt-8 mb-20">
          <HomeHero />
        </Container>

        {/* 2. Why Families Choose Us */}
        <HomeValueProps />

        {/* 3. Vendor Ribbon CTA */}
        <Container className="py-12">
          <div className="relative overflow-hidden bg-gradient-to-r from-secondary-denim/20 via-primary-orange/15 to-secondary-denim/20 border-2 border-primary-orange/30 rounded-2xl p-10 text-center shadow-2xl hover:shadow-primary-orange/20 transition-all duration-300 hover:scale-[1.02] group">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/5 via-transparent to-secondary-denim/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-orange/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary-denim/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary-orange/20 rounded-full border border-primary-orange/30">
                <span className="text-primary-orange font-bold text-sm uppercase tracking-wider">✨ Limited Time</span>
              </div>
              
              <p className="text-3xl font-bold text-paper mb-4 leading-tight">
                Are you a coach, photographer, or rep?{" "}
                <a
                  href="/list-your-business"
                  className="text-primary-orange hover:text-secondary-denim font-bold transition-all duration-300 text-3xl underline decoration-2 underline-offset-4 hover:decoration-secondary-denim hover:scale-105 inline-block"
                >
                  List your business here →
                </a>
              </p>
              
              <p className="text-lg text-paper/80 max-w-2xl mx-auto">
                Join 12,000+ families already using our directory. Get featured placement, build trust, and grow your business.
              </p>
            </div>
          </div>
        </Container>

        {/* 4. Featured Vendors */}
        <Container className="py-16">
          <HomeFeaturedListings />
        </Container>

        {/* 5. How It Works (for Families) */}
        <Container className="py-16">
          <HomeHowItWorks />
        </Container>

        {/* 6. Newsletter Signup (Families) */}
        <Container className="py-16">
          <NewsletterCard />
        </Container>
      </div>
    </>
  );
}
