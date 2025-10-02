import Container from "@/components/container";
import { DirectoryFilters } from "@/components/directory/directory-filters";
import ItemGrid from "@/components/item/item-grid";
import SearchBox from "@/components/search/search-box";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/item-service";
import { getCategories } from "@/data/categories";
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
  try {
    categories = await getCategories();
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
    <div className="flex flex-col">
      {/* Header */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Professional Directory
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Browse our complete directory of vetted child actor professionals.
            Every listing has been carefully reviewed for quality, safety, and
            results.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 rounded-lg border border-brand-blue/20">
            <div className="text-3xl font-bold text-brand-blue mb-2">
              {totalCount}
            </div>
            <div className="text-muted-foreground">Total Professionals</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 rounded-lg border border-brand-blue/20">
            <div className="text-3xl font-bold text-brand-blue mb-2">8</div>
            <div className="text-muted-foreground">Categories</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 rounded-lg border border-brand-blue/20">
            <div className="text-3xl font-bold text-brand-blue mb-2">1000+</div>
            <div className="text-muted-foreground">Families Served</div>
          </div>
        </div>
      </Container>

      {/* Search */}
      <Container className="pb-8">
        <div className="mb-8">
          <SearchBox urlPrefix="/directory" />
        </div>
      </Container>

      {/* Filters */}
      <Container className="pb-8">
        <DirectoryFilters className="mb-8" categories={categories} />
      </Container>

      {/* Listings */}
      <Container className="pb-16">
        <div className="flex flex-col gap-8">
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
                <CustomPagination
                  routePrefix="/directory"
                  totalPages={totalPages}
                />
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
