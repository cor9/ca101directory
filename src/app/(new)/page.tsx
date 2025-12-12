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
  title: "Child Actor 101 Directory - Find Trusted Acting Professionals",
  description:
    "Find 250+ trusted acting coaches, headshot photographers, talent agents, and managers for child actors in Los Angeles, New York, Atlanta & nationwide. 101 Approved professionals.",
  canonicalUrl: `${siteConfig.url}/`,
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
    <div className="min-h-screen bg-[#0F121A]">
      {/* Hero Section with Featured Vendor */}
      <section className="page-width py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left: Hero Content */}
          <div className="lg:col-span-3">
            <Hero />
          </div>

          {/* Right: Featured Vendor Card */}
          <div className="lg:col-span-2">
            <FeaturedVendor vendor={featuredItem} />
          </div>
        </div>
      </section>

      {/* Suggest a Vendor CTA */}
      <section className="page-width py-4">
        <p className="text-gray-300">
          Know someone great?{" "}
          <a
            href="/suggest-vendor"
            className="text-[#F2C94C] font-semibold hover:underline hover:scale-105 transition-all duration-200 inline-block"
          >
            Suggest a vendor +
          </a>
        </p>
      </section>

      {/* Popular This Week */}
      <section className="page-width py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Popular This Week</h2>
        <PopularVendors vendors={popularVendors} />
      </section>

      {/* Explore Topics Grid */}
      <section className="page-width py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Explore topics</h2>
        <CategoryGrid categories={categories} />
      </section>
    </div>
  );
}
