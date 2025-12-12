import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
import { constructMetadata } from "@/lib/metadata";
import { DEFAULT_SORT } from "@/lib/constants";
import Hero from "./components/Hero";
import FeaturedVendor from "./components/FeaturedVendor";
import PopularVendors from "./components/PopularVendors";
import CategoryGrid from "./components/CategoryGrid";

// Ensure homepage is always fresh
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = constructMetadata({
  title: "New Homepage Preview - Child Actor 101 Directory",
  description:
    "Preview of the new Patreon-inspired homepage design for Child Actor 101 Directory.",
  canonicalUrl: `${siteConfig.url}/new-home`,
});

export default async function NewHomePage() {
  // Fetch categories
  let categories = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Fetch listings for homepage
  let items = [];
  let featuredItem = null;
  try {
    const result = await getItems({
      sortKey: DEFAULT_SORT.sortKey,
      reverse: DEFAULT_SORT.reverse,
      currentPage: 1,
      hasSponsorItem: false,
    });
    items = result.items;
    // Get a featured/verified item if available
    featuredItem = items.find((item: any) => item.is_verified) || items[0];
  } catch (error) {
    console.error("Error fetching items:", error);
  }

  // Get popular vendors (first 6 for horizontal scroll)
  const popularVendors = items.slice(0, 6);

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Hero Section */}
      <Hero />

      {/* Featured Vendor + Popular Section */}
      <section className="section grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-semibold text-text-primary mb-6">
            Popular This Week
          </h2>
          <PopularVendors vendors={popularVendors} />
        </div>

        <div>
          <FeaturedVendor vendor={featuredItem} />
        </div>
      </section>

      {/* Explore Topics Grid */}
      <section className="section">
        <h2 className="text-3xl font-semibold text-text-primary mb-6">
          Explore Topics
        </h2>
        <CategoryGrid categories={categories} />
      </section>
    </div>
  );
}
