import Container from "@/components/container";
import { DirectoryFilters } from "@/components/directory/directory-filters";
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
import { getItems } from "@/data/airtable-item";
import { getCategories } from "@/data/categories";
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
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Fetch first few listings for homepage preview
  const { items, totalCount } = await getItems({
    sortKey: DEFAULT_SORT.sortKey,
    reverse: DEFAULT_SORT.reverse,
    currentPage: 1,
    hasSponsorItem: false,
  });

  // Show only first 6 items on homepage
  const previewItems = items.slice(0, 6);

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

        {/* Parent CTA Section */}
        <Container className="py-16">
          <HomeParentCta />
        </Container>

        {/* Featured Listings Section */}
        <Container className="py-16">
          <HomeFeaturedListings />
        </Container>

        {/* Directory Preview Section */}
        <Container className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Browse Our Directory
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search and filter through our complete directory of {totalCount}{" "}
              vetted child actor professionals.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBox urlPrefix="/directory" />
          </div>

          {/* Filters */}
          <div className="mb-8">
            <DirectoryFilters className="mb-8" categories={categories} />
          </div>

          {/* Listings Grid */}
          <div id="search-results">
            <ItemGrid
              items={previewItems}
              sponsorItems={[]}
              showSponsor={false}
            />
          </div>

          {/* View More Button */}
          <div className="text-center mt-12">
            <a
              href="/directory"
              className="px-6 py-3 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark transition-colors"
            >
              View All {totalCount} Professionals
            </a>
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

        {/* Newsletter Section */}
        <Container className="py-16">
          <NewsletterCard />
        </Container>
      </div>
    </>
  );
}
