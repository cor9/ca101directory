import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/airtable-item";
import { getPublicListings } from "@/data/listings";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Generate static params for all tag pages
 * This tells Next.js which tag pages to pre-build
 */
export async function generateStaticParams() {
  try {
    const listings = await getPublicListings();

    // Extract unique age ranges (tags) from all listings
    const allAgeRanges = new Set<string>();
    listings.forEach((listing) => {
      if (listing["Age Range"]) {
        // Age Range is a comma-separated string in Supabase
        listing["Age Range"].split(',').forEach((tag) => {
          allAgeRanges.add(
            tag.trim()
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
          );
        });
      }
    });

    // Convert age ranges to slugs
    return Array.from(allAgeRanges).map((ageRange) => ({
      slug: ageRange,
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    // Return empty array if Supabase is not configured
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  try {
    const listings = await getPublicListings();

    // Find listings that match this tag (age range)
    const matchingListings = listings.filter((listing) => {
      if (!listing["Age Range"]) return false;
      return listing["Age Range"].split(',').some(
        (tag) =>
          tag.trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "") === params.slug,
      );
    });

    if (matchingListings.length === 0) {
      return constructMetadata({
        title: "Tag Not Found - Child Actor 101 Directory",
        description: "The requested tag could not be found",
        canonicalUrl: `${siteConfig.url}/tag/${params.slug}`,
      });
    }

    // Get the actual age range name from the first matching listing
    const ageRangeName = matchingListings[0]["Age Range"]?.split(',').find(
      (tag) =>
        tag.trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") === params.slug,
    )?.trim();

    return constructMetadata({
      title: `${ageRangeName} - Child Actor 101 Directory`,
      description: `Find acting professionals for ${ageRangeName} age range`,
      canonicalUrl: `${siteConfig.url}/tag/${params.slug}`,
    });
  } catch (error) {
    console.error("generateMetadata error:", error);
    return constructMetadata({
      title: "Tag - Child Actor 101 Directory",
      description: "Find acting professionals by age range",
      canonicalUrl: `${siteConfig.url}/tag/${params.slug}`,
    });
  }
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  try {
    const listings = await getPublicListings();

    // Find listings that match this tag (age range)
    const matchingListings = listings.filter((listing) => {
      if (!listing["Age Range"]) return false;
      return listing["Age Range"].split(',').some(
        (tag) =>
          tag.trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "") === params.slug,
      );
    });

    if (matchingListings.length === 0) {
      return notFound();
    }

    // Get the actual age range name from the first matching listing
    const ageRangeName = matchingListings[0]["Age Range"]?.split(',').find(
      (tag) =>
        tag.trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") === params.slug,
    )?.trim();

    // For now, we don't have sponsor items in Airtable
    const sponsorItems: any[] = [];
    const showSponsor = false;
    const hasSponsorItem = false;

    const { sort, page } = searchParams as { [key: string]: string };
    const { sortKey, reverse } =
      SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
    const currentPage = page ? Number(page) : 1;

    const { items, totalCount } = await getItems({
      tag: params.slug,
      sortKey,
      reverse,
      currentPage,
      hasSponsorItem,
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
      <div>
        {/* Tag header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {ageRangeName}
          </h1>
          <p className="text-lg text-gray-600">
            Find acting professionals for {ageRangeName} age range
          </p>
        </div>

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
                routePrefix={`/tag/${params.slug}`}
                totalPages={totalPages}
              />
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error("TagPage error:", error);
    return notFound();
  }
}
