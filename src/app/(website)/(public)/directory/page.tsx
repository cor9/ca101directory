export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import Container from "@/components/container";
import { SuggestVendorCTA } from "@/components/cta/SuggestVendorCTA";
import { CategoryTipCard } from "@/components/directory/CategoryTipCard";
import DirectoryClient from "@/components/directory/DirectoryClient";
import ResultsPagination from "@/components/directory/ResultsPagination";
import DirectoryHeroSearch from "@/components/directory/DirectoryHeroSearch";
import { StatusPills } from "@/components/directory/StatusPills";
import WhyParentsTrust from "@/components/directory/WhyParentsTrust";
import { ActivityBar } from "@/components/home/ActivityBar";
import { QuickFindBlock } from "@/components/home/QuickFindBlock";
import HomeFeaturedListings from "@/components/home/home-featured-listings";
import EmptyGrid from "@/components/shared/empty-grid";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
import { regionsList, stateNames } from "@/data/regions";
import { DIRECTORY_ITEMS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { createServerClient } from "@/lib/supabase";
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

  // Fetch unique states from listings
  let states: string[] = [];
  try {
    const supabase = createServerClient();
    const { data: statesData } = await supabase
      .from("listings")
      .select("state")
      .neq("state", null)
      .neq("state", "")
      .order("state", { ascending: true });

    if (statesData) {
      states = Array.from(
        new Set(statesData.map((item) => item.state).filter(Boolean)),
      ) as string[];
    }
  } catch (error) {
    console.error("Error fetching states:", error);
  }

  const sp = (searchParams ?? {}) as { [key: string]: string | undefined };
  const {
    page,
    category,
    state,
    region,
    city,
    q: query,
    verified,
    online_available,
    age_groups,
    price_max,
    beginner_friendly,
    technique_focus,
    union_status,
  } = sp;
  const currentPage = Math.max(1, Number.parseInt(page || "1", 10) || 1);

  // Category arrives as a UUID from the filter UI; getItems resolves UUID,
  // name or slug and enforces it strictly. The name is only used for display.
  const categoryFilter = category && category !== "all" ? category : undefined;
  const categoryName = categoryFilter
    ? categories.find((cat) => cat.id === categoryFilter)?.category_name
    : undefined;
  const stateFilter = state && state !== "all" ? state : undefined;

  // Any search/filter hides the global Featured/Pro showcase and lets
  // matching featured listings rank first inside the results instead.
  const filtersActive = Boolean(
    query?.trim() ||
      categoryFilter ||
      stateFilter ||
      city?.trim() ||
      region ||
      online_available === "true" ||
      age_groups ||
      verified === "true" ||
      price_max ||
      beginner_friendly === "true" ||
      technique_focus ||
      union_status,
  );

  const { items, totalCount, itemsPerPage } = await getItems({
    category: categoryFilter,
    state: stateFilter,
    city: city?.trim() || undefined,
    region,
    query,
    currentPage,
    itemsPerPage: DIRECTORY_ITEMS_PER_PAGE,
    excludeFeatured: !filtersActive, // featured block above already shows them
    onlineAvailable: online_available === "true",
    ageGroups: age_groups ? age_groups.split(",") : undefined,
    verified: verified === "true",
    priceMax: price_max ? Number(price_max) || undefined : undefined,
    techniqueFocus: technique_focus ? technique_focus.split(",") : undefined,
    beginnerFriendly: beginner_friendly === "true",
    unionStatus: union_status || undefined,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const locationLabel = [city?.trim(), stateFilter ? stateNames[stateFilter.toUpperCase()] ?? stateFilter : null]
    .filter(Boolean)
    .join(", ");
  const heading = [
    categoryName || (filtersActive ? "Search Results" : "All Professionals"),
    locationLabel ? `in ${locationLabel}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col bg-bg-dark min-h-screen">
      {/* Search-First Hero */}
      <DirectoryHeroSearch categories={categories} />

      {/* Proof of Life Strip */}
      <ActivityBar />

      {/* Quick Find Shortcut Block */}
      <QuickFindBlock />

      {/* Optional helper text */}
      <Container className="py-4">
        <p className="text-sm text-text-muted text-center">
          Use filters to narrow by specialty and location.
        </p>
      </Container>

      {/* Featured Vendors: only on the unfiltered directory */}
      {!filtersActive && (
        <Container className="py-8">
          <HomeFeaturedListings />
        </Container>
      )}

      {/* Listings Grid */}
      <section id="search-results" className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tip Card - Micro-learning */}
        {categoryName && <CategoryTipCard category={categoryName} />}

        <div className="mb-6">
          <h2 className="bauhaus-heading text-2xl text-white mb-4">
            {heading}
            <span className="text-white/50 text-lg font-normal ml-2">
              ({totalCount} results)
            </span>
          </h2>

          {/* Status Pills - Context indicators above results */}
          <div className="mb-4">
            <p className="text-xs text-text-muted mb-2">
              Showing listings that are:
            </p>
            <StatusPills
              verified={verified === "true"}
              featured={false} // Featured is handled separately
              pro={false} // Pro is handled separately
              onlineOnly={false} // Can be added if format filter exists
            />
          </div>
        </div>

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

        <ResultsPagination
          basePath="/directory"
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={sp}
        />
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
