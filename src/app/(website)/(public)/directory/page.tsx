export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import Container from "@/components/container";
import DirectoryHeroSearch from "@/components/directory/DirectoryHeroSearch";
import DirectoryClient from "@/components/directory/DirectoryClient";
import { DirectoryFilters } from "@/components/directory/directory-filters";
import WhyParentsTrust from "@/components/directory/WhyParentsTrust";
import EmptyGrid from "@/components/shared/empty-grid";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
import { regionsList } from "@/data/regions";
import HomeFeaturedListings from "@/components/home/home-featured-listings";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Directory - Child Actor 101 Directory",
  description:
    "Browse our complete directory of vetted child actor professionals",
  canonicalUrl: `${siteConfig.url}/directory`,
});

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Fetch categories for filters
  let categories: Array<{ id: string; category_name: string }> = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  const {
    page,
    category,
    state,
    region,
    q: query,
  } = searchParams as {
    [key: string]: string;
  };
  const currentPage = page ? Number(page) : 1;

  // Convert category ID to category name
  let categoryName: string | undefined = undefined;
  if (category && category !== "all") {
    const foundCategory = categories.find((cat) => cat.id === category);
    categoryName = foundCategory?.category_name;
    console.log("DirectoryPage: Category mapping:", {
      categoryId: category,
      categoryName,
      foundCategory,
    });
  }

  console.log("DirectoryPage: Getting items with params:", {
    category,
    categoryName,
    state,
    region,
    query,
    currentPage,
  });

  const { items, totalCount } = await getItems({
    category: categoryName, // Pass category name instead of ID
    state,
    region,
    query,
    currentPage,
    excludeFeatured: true, // avoid repeating featured listings shown above
  });

  console.log("DirectoryPage: Received items:", {
    itemsCount: items?.length || 0,
    totalCount,
    sampleItems: items?.slice(0, 2),
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col bg-[#0C1A2B]">
      {/* Search-First Hero */}
      <DirectoryHeroSearch categories={categories} />

      {/* Filters (compact) */}
      <Container className="py-6">
        <DirectoryFilters className="" categories={categories} />
      </Container>

      {/* Featured Vendors */}
      <Container className="py-8">
        <HomeFeaturedListings />
      </Container>

      {/* Listings Grid */}
      <section id="search-results" className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="bauhaus-heading text-2xl text-white mb-6">
          All Professionals
          <span className="text-white/50 text-lg font-normal ml-2">
            ({totalCount} results)
          </span>
        </h2>

        {/* when no items are found */}
        {items?.length === 0 && <EmptyGrid />}

        {/* when items are found - use client component for Load More */}
        {items && items.length > 0 && (
          <DirectoryClient
            initialItems={items}
            initialTotalCount={totalCount}
            initialTotalPages={totalPages}
          />
        )}
      </section>

      {/* Why Parents Trust Us (moved below listings) */}
      <WhyParentsTrust
        totalListings={totalCount}
        categoriesCount={categories?.length}
        regionsCount={regionsList.length}
      />
    </div>
  );
}
