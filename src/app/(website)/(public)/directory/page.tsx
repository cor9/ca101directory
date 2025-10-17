import Container from "@/components/container";
import DirectoryHeader from "@/components/directory/DirectoryHeader";
import ListingCard from "@/components/directory/ListingCard";
import { DirectoryFilters } from "@/components/directory/directory-filters";
import ItemGrid from "@/components/item/item-grid";
import SearchBox from "@/components/search/search-box";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getCategories, getCategoryIconsMap } from "@/data/categories";
import { getItems } from "@/data/item-service";
import { regionsList } from "@/data/regions";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
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
  let categories = [];
  let categoryIconMap: Record<string, string> = {};
  try {
    categories = await getCategories();
    categoryIconMap = await getCategoryIconsMap();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // No sponsor items for now
  const sponsorItems: unknown[] = [];
  const showSponsor = false;
  const hasSponsorItem = false;

  const {
    sort,
    page,
    category,
    state,
    region,
    q: query,
  } = searchParams as {
    [key: string]: string;
  };
  const { sortKey, reverse } =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
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
    sortKey,
    reverse,
    currentPage,
    hasSponsorItem,
  });

  const { items, totalCount } = await getItems({
    category: categoryName, // Pass category name instead of ID
    state,
    region,
    query,
    sortKey,
    reverse,
    currentPage,
    hasSponsorItem,
  });

  console.log("DirectoryPage: Received items:", {
    itemsCount: items?.length || 0,
    totalCount,
    sampleItems: items?.slice(0, 2),
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="bauhaus">
      <main>
        <div className="card hollywood-accent">
          <DirectoryHeader
            total={totalCount}
            categoriesCount={categories?.length}
            regionsCount={regionsList.length}
          />
        </div>

      {/* Search */}
      <Container className="pb-8">
        <div className="card">
          <SearchBox urlPrefix="/directory" />
        </div>
      </Container>

      {/* Filters */}
      <Container className="pb-8">
        <div className="card">
          <DirectoryFilters className="mb-0" categories={categories} />
        </div>
      </Container>

      {/* Listings */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* when no items are found */}
        {items?.length === 0 && <EmptyGrid />}

        {/* when items are found */}
        {items && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it) => (
                <div className="card" key={it._id}>
                  <div>
                    <ListingCard
                      key={it._id}
                      item={it}
                      categoryIconMap={categoryIconMap}
                      allCategories={categories?.map((c) => c.category_name) || []}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <div className="card" style={{ borderRadius: 9999 }}>
                <CustomPagination
                  routePrefix="/directory"
                  totalPages={totalPages}
                />
              </div>
            </div>
          </>
        )}
      </section>
      </main>
    </div>
  );
}
