import Container from "@/components/container";
import CategoryTiles from "@/components/home/CategoryTiles";
import FeaturedListingsGrid from "@/components/home/FeaturedListingsGrid";
import HomeHero from "@/components/home/HomeHero";
import CategoryTileGrid from "@/components/home/category-tile-grid";
import HomeFeaturedListings from "@/components/home/home-featured-listings";
import HomeSearchBox from "@/components/home/home-search-box";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ListingCardClient } from "@/components/listings/ListingCardClient";
import { OrganizationSchema } from "@/components/seo/listing-schema";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
import { getFeaturedListings, getPublicListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { DEFAULT_SORT } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import Script from "next/script";
import { Suspense } from "react";

// Ensure homepage is always fresh so Featured updates reflect immediately
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = constructMetadata({
  title: "Child Actor 101 Directory - Find Trusted Acting Professionals",
  description:
    "Find 250+ trusted acting coaches, headshot photographers, talent agents, and managers for child actors in Los Angeles, New York, Atlanta & nationwide. 101 Approved professionals.",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function Page() {
  // Fetch categories for filters
  let categories = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Fetch first few listings for homepage preview
  let items = [];
  try {
    const result = await getItems({
      sortKey: DEFAULT_SORT.sortKey,
      reverse: DEFAULT_SORT.reverse,
      currentPage: 1,
      hasSponsorItem: false,
    });
    items = result.items;
  } catch (error) {
    console.error("Error fetching items:", error);
  }

  // Show only first 12 items on homepage
  const previewItems = items.slice(0, 12);

  let user = null;
  try {
    user = await currentUser();
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  return (
    <>
      {/* Schema.org Organization Data for SEO */}
      <OrganizationSchema />

      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />

      <div className="flex flex-col bg-bg text-text-primary">
        <Navbar scroll={true} config={marketingConfig} user={user} />
        <main>
          {/* Hero Section */}
          <HomeHero />

          {/* Credibility Strip */}
          <section className="bg-bg-dark border-t border-border-subtle py-6">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 text-sm text-text-muted">
                <div>1,000+ vetted professionals</div>
                <div>25+ industry categories</div>
                <div>Used by families nationwide</div>
              </div>
            </div>
          </section>

          {/* Category Tiles */}
          <CategoryTiles />

          {/* Vendor CTA - Bridge between categories and listings */}
          <section className="bg-bg-dark py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="rounded-xl border border-border-subtle bg-bg-dark-2 px-6 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      Are you a trusted industry professional working with young
                      actors?
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">
                      List your services where families already come looking for
                      vetted support.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <a
                      href="/submit"
                      className="rounded-md bg-accent-blue px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
                    >
                      List Your Services
                    </a>
                    <a
                      href="/pricing"
                      className="text-sm text-text-secondary hover:text-text-primary transition"
                    >
                      Learn how listings work →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Listings */}
          <section className="bg-bg-dark py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">
                  Featured Professionals
                </h2>
                <a
                  href="/directory"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  View all →
                </a>
              </div>
              <Suspense fallback={<div className="h-48 bg-bg-2 rounded-lg" />}>
                <FeaturedListingsGrid />
              </Suspense>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
