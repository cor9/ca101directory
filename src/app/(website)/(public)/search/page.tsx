import Container from "@/components/container";
import { DirectoryFilters } from "@/components/directory/directory-filters";
import HomeSearchBox from "@/components/home/home-search-box";
import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Child Actor 101 Directory",
  description: "Find trusted acting professionals for your child",
  canonicalUrl: `${siteConfig.url}/search`,
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log("SearchPage, searchParams", searchParams);

  // Fetch categories for filters
  let categories = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // No sponsor items for now - we'll implement this later if needed
  const sponsorItems: unknown[] = [];
  const showSponsor = false;
  const hasSponsorItem = false;

  const {
    category,
    tag,
    sort,
    page,
    q: query,
    f: filter,
    state,
    region,
  } = searchParams as { [key: string]: string };

  // Convert category ID to category name
  let categoryName: string | undefined = undefined;
  if (category && category !== "all") {
    const foundCategory = categories.find((cat) => cat.id === category);
    categoryName = foundCategory?.category_name;
    console.log("SearchPage: Category mapping:", {
      categoryId: category,
      categoryName,
      foundCategory,
    });
  }

  const { sortKey, reverse } =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({
    category: categoryName, // Pass category name instead of ID
    tag,
    state,
    region,
    sortKey,
    reverse,
    query,
    filter,
    currentPage,
    hasSponsorItem,
  });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log("SearchPage, totalCount", totalCount, ", totalPages", totalPages);

  return (
    <div className="container max-w-7xl py-16">
      <div className="text-center mb-12">
        <h1 className="bauhaus-heading text-3xl mb-4">
          {query ? `Search Results for "${query}"` : "Search Professionals"}
        </h1>
        <p className="bauhaus-body text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          {query
            ? `Found ${totalCount} professional${totalCount !== 1 ? "s" : ""} matching your search`
            : "Search our directory of vetted child actor professionals"}
        </p>

        {/* Search Box */}
        <div className="max-w-md mx-auto">
          <HomeSearchBox urlPrefix="/search" />
        </div>
      </div>

      {/* Filters */}
      <Container className="pb-8">
        <DirectoryFilters className="mb-8" categories={categories} />
      </Container>

      {/* when no items are found */}
      {items?.length === 0 && <EmptyGrid />}

      {/* when items are found */}
      {items && items.length > 0 && (
        <section className="">
          <ItemGrid
            items={items}
            sponsorItems={sponsorItems}
            showSponsor={showSponsor}
          />

          <div className="mt-8 flex items-center justify-center">
            <CustomPagination routePrefix="/search" totalPages={totalPages} />
          </div>
        </section>
      )}
    </div>
  );
}
