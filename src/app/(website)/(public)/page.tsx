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
        <Container className="py-8">
          <div className="bg-gradient-to-r from-retro-blue/10 to-tomato-red/10 border border-retro-blue/20 rounded-lg p-6 text-center">
            <p className="text-lg text-charcoal mb-2">
              Are you a coach, photographer, or rep?{" "}
              <a 
                href="/list-your-business" 
                className="text-retro-blue hover:text-tomato-red font-semibold transition-colors"
              >
                List your business here →
              </a>
            </p>
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
