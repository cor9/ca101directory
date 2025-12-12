import Container from "@/components/container";
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
    <div className="flex flex-col min-h-screen bg-bg-dark text-text-primary">
      <Navbar scroll={true} config={marketingConfig} user={user} />
      <main className="flex-1 pt-16">
        {/* Schema.org Organization Data for SEO */}
        <OrganizationSchema />

        <Script
          src="https://js.stripe.com/v3/pricing-table.js"
          strategy="afterInteractive"
        />

        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <HomeSidebar categories={categories} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-8">
              {/* Hero Section - Simplified */}
              <section className="space-y-4">
                <h1 className="text-4xl font-bold text-text-primary">
                  Find Trusted Acting Professionals
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl">
                  Connect with vetted coaches, photographers, agents, and more
                  for your child's acting journey.
                </p>
                <div className="max-w-md">
                  <Suspense
                    fallback={<div className="h-12 bg-bg-dark-2 rounded-lg" />}
                  >
                    <HomeSearchBox urlPrefix="/" />
                  </Suspense>
                </div>
              </section>

              {/* Featured Professionals */}
              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-6">
                  Featured Professionals
                </h2>
                <Suspense
                  fallback={<div className="h-48 bg-bg-dark-2 rounded-lg" />}
                >
                  <HomeFeaturedListings />
                </Suspense>
              </section>

              {/* Browse by Category */}
              <Suspense
                fallback={
                  <div className="text-text-secondary">Loading categories...</div>
                }
              >
                <CategoryTileGrid />
              </Suspense>

              {/* Newest / Recently Updated */}
              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-6">
                  Newest Professionals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {previewItems.map((item) => (
                    <ListingCardClient key={item.id} listing={item} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
