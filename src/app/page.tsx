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
  title: "Child Actor 101 Vendor Directory - Find Acting Professionals for Your Child",
  description:
    "Find acting coaches, headshot photographers, talent agents, and managers for child actors in Los Angeles, New York, Atlanta & nationwide.",
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

          {/* Credibility strip: warm band directly under the dark hero */}
          <section className="border-b border-canvas-line bg-canvas-2 py-5">
            <ul className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 px-6 text-sm font-medium text-ink-2 sm:flex-row sm:gap-0 sm:divide-x sm:divide-canvas-line">
              <li className="sm:px-8">1,000+ listed professionals</li>
              <li className="sm:px-8">13 categories of professionals</li>
              <li className="sm:px-8">Used by families nationwide</li>
            </ul>
          </section>

          {/* Category Tiles */}
          <CategoryTiles />

          {/* Featured Listings */}
          <section className="surface-canvas-2 py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4">
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Featured</p>
                  <h2 className="heading-display mt-3 text-3xl text-ink md:text-4xl">
                    Featured professionals
                  </h2>
                </div>
                <a
                  href="/directory"
                  className="text-sm font-semibold !text-brass-dark underline underline-offset-4"
                >
                  View all →
                </a>
              </div>
              <Suspense fallback={<div className="h-48 rounded-lg bg-canvas-3" />}>
                <FeaturedListingsGrid />
              </Suspense>
            </div>
          </section>

          {/* Vendor invitation: navy band, one brass action */}
          <section className="surface-navy py-16 md:py-20">
            <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <p className="eyebrow">For professionals</p>
                <h2 className="heading-display mt-3 text-3xl text-white md:text-4xl">
                  Work with young performers? Add your listing.
                </h2>
                <p className="mt-4 text-lg !text-zinc-300">
                  Create a free listing so families can discover your services or
                  professional information.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <a href="/submit" className="btn-brass focus-ring">
                  Add Your Listing
                </a>
                <a
                  href="/pricing"
                  className="text-sm font-medium !text-white underline decoration-brass underline-offset-[6px]"
                >
                  Learn how listings work
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
