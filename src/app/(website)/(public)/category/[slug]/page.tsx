import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/airtable-item";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  // For now, use a generic category title until Airtable integration is complete
  const categoryName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return constructMetadata({
    title: `${categoryName} - Child Actor 101 Directory`,
    description: `Find ${categoryName.toLowerCase()} professionals for your child's acting career`,
    canonicalUrl: `${siteConfig.url}/category/${params.slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // For now, we don't have sponsor items in Airtable
  const sponsorItems: any[] = [];
  const showSponsor = false; // Disable sponsor items for now
  const hasSponsorItem = false;

  const { sort, page } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({
    category: params.slug,
    sortKey,
    reverse,
    currentPage,
    hasSponsorItem,
  });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log(
    "CategoryPage, totalCount",
    totalCount,
    ", totalPages",
    totalPages,
  );

  return (
    <div>
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
              routePrefix={`/category/${params.slug}`}
              totalPages={totalPages}
            />
          </div>
        </section>
      )}
    </div>
  );
}
