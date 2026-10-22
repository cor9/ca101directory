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
import { PRIMARY_CATEGORIES, resolveCategoryRef } from "@/lib/category-taxonomy";
import { getItems } from "@/data/item-service";
import { regionsList, stateNames } from "@/data/regions";
import { DIRECTORY_ITEMS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import { createServerClient } from "@/lib/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Directory - Child Actor 101 Vendor Directory",
  description:
    "Browse the complete directory of professionals who work with young actors",
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
    specialty,
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
  const categoryRef = categoryFilter
    ? resolveCategoryRef(categoryFilter)
    : null;
  const categoryName =
    categoryRef?.kind === "primary" || categoryRef?.kind === "legacy"
      ? categoryRef.primary.name
      : categoryRef?.kind === "retired"
        ? categoryRef.retired.name
        : categoryFilter
          ? categories.find((cat) => cat.id === categoryFilter)?.category_name
          : undefined;
  // A legacy value implies its specialty (e.g. Improv Classes -> Improv)
  const specialtyFilter =
    specialty?.trim() ||
    (categoryRef?.kind === "legacy" ? categoryRef.specialty : null) ||
    undefined;
  const stateFilter = state && state !== "all" ? state : undefined;

  // Any search/filter hides the global Featured/Pro showcase and lets
  // matching featured listings rank first inside the results instead.
  const filtersActive = Boolean(
    query?.trim() ||
      categoryFilter ||
      specialtyFilter ||
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
    specialty: specialtyFilter,
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
    [categoryName, specialtyFilter].filter(Boolean).join(" · ") ||
      (filtersActive ? "Search Results" : "All Professionals"),
    locationLabel ? `in ${locationLabel}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex min-h-screen flex-col bg-bg-dark">
      {/* Search-first dark hero */}
      <DirectoryHeroSearch categories={categories} />

      {/* Badge legend: a warm band that hands off from dark to light */}
      <ActivityBar />

      {/* Light, editorial results zone: white listing cards sit on warm paper */}
      <div className="surface-canvas">
        <QuickFindBlock />

        {/* Featured professionals: only on the unfiltered directory */}
        {!filtersActive && (
          <Container className="py-10">
            <p className="eyebrow">Featured</p>
            <h2 className="heading-display mb-8 mt-3 text-3xl text-ink">
              Featured professionals
            </h2>
            <HomeFeaturedListings />
          </Container>
        )}

        {/* Listings grid */}
        <section
          id="search-results"
          className="mx-auto w-full max-w-[1480px] px-5 py-10 sm:px-8 lg:px-12"
        >
          {categoryName && <CategoryTipCard category={categoryName} />}

          <div className="mb-8 border-t border-canvas-line pt-10">
            <p className="eyebrow">{filtersActive ? "Results" : "The directory"}</p>
            <h2 className="heading-display mt-3 text-3xl text-ink">
              {heading}
              <span className="ml-3 text-lg font-normal text-ink-soft">
                ({totalCount} results)
              </span>
            </h2>
            <div className="mt-3">
              <StatusPills
                verified={verified === "true"}
                featured={false}
                pro={false}
                onlineOnly={false}
              />
            </div>
          </div>

          {items?.length === 0 && <EmptyGrid />}

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
      </div>

      {/* Navy trust band closes the page before the dark footer */}
      <WhyParentsTrust
        totalListings={totalCount}
        categoriesCount={PRIMARY_CATEGORIES.length}
        regionsCount={regionsList.length}
      />
    </div>
  );
}
