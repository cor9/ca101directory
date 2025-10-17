import ItemGrid from "@/components/item/item-grid";
import { CategoryContent } from "@/components/seo/category-content";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
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
 * Generate static params for all category pages
 * This tells Next.js which category pages to pre-build
 */
export async function generateStaticParams() {
  try {
    const categories = await getCategories();

    // Convert category names to slugs
    return categories.map((category) => ({
      slug: category.category_name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters first
        .replace(/\s+/g, "-") // Then replace spaces with dashes
        .replace(/-+/g, "-") // Replace multiple dashes with single dash
        .replace(/^-|-$/g, ""), // Remove leading/trailing dashes
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
    const categories = await getCategories();

    const category = categories.find((cat) => {
      const generatedSlug = cat.category_name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters first
        .replace(/\s+/g, "-") // Then replace spaces with dashes
        .replace(/-+/g, "-") // Replace multiple dashes with single dash
        .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
      return generatedSlug === params.slug;
    });

    if (!category) {
      return constructMetadata({
        title: "Category Not Found - Child Actor 101 Directory",
        description: "The requested category could not be found",
        canonicalUrl: `${siteConfig.url}/category/${params.slug}`,
      });
    }

    // Get listing count for this category
    const listings = await getPublicListings();
    const categoryListings = listings.filter(
      (listing) =>
        listing.categories?.includes(category.category_name) &&
        listing.status === "Live" &&
        listing.is_active
    );
    const count = categoryListings.length;

    return constructMetadata({
      title: `${category.category_name} for Child Actors - ${count}+ Professionals | Child Actor 101`,
      description: `Compare ${count} professional ${category.category_name.toLowerCase()} specializing in child actors. Read reviews, compare services, and find the perfect match in Los Angeles, New York & nationwide.`,
      canonicalUrl: `${siteConfig.url}/category/${params.slug}`,
    });
  } catch (error) {
    console.error("generateMetadata error:", error);
    return constructMetadata({
      title: "Category - Child Actor 101 Directory",
      description: "Find acting professionals for your child",
      canonicalUrl: `${siteConfig.url}/category/${params.slug}`,
    });
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  try {
    // Get categories to validate the slug and find category name
    const categories = await getCategories();

    const category = categories.find((cat) => {
      const generatedSlug = cat.category_name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters first
        .replace(/\s+/g, "-") // Then replace spaces with dashes
        .replace(/-+/g, "-") // Replace multiple dashes with single dash
        .replace(/^-|-$/g, ""); // Remove leading/trailing dashes
      return generatedSlug === params.slug;
    });

    if (!category) {
      console.log("CategoryPage: No category found for slug:", params.slug);
      return notFound();
    }

    const categoryName = category.category_name;

    console.log("CategoryPage Debug:", {
      slug: params.slug,
      categoryName,
      category,
    });

    // For now, we don't have sponsor items in Airtable
    const sponsorItems: unknown[] = [];
    const showSponsor = false;
    const hasSponsorItem = false;

    const { sort, page } = searchParams as { [key: string]: string };
    const { sortKey, reverse } =
      SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
    const currentPage = page ? Number(page) : 1;

    const { items, totalCount } = await getItems({
      category: categoryName, // Use the actual category name, not the slug
      sortKey,
      reverse,
      currentPage,
      hasSponsorItem,
    });

    console.log("CategoryPage: getItems result:", {
      itemsCount: items?.length || 0,
      totalCount,
      categoryName,
      items: items?.slice(0, 3), // Show first 3 items for debugging
    });

    // Debug: Test getPublicListings directly
    const directListings = await getPublicListings({ category: categoryName });
    console.log("CategoryPage: Direct getPublicListings result:", {
      directCount: directListings?.length || 0,
      categoryName,
      sampleListings: directListings?.slice(0, 3),
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
      <div>
        {/* Category header - Bauhaus theme with proper contrast */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface mb-2">
            {categoryName}
          </h1>
          <p className="text-lg text-surface/80">
            Find {categoryName.toLowerCase()} professionals for your child's
            acting career
          </p>
        </div>

        {/* SEO-rich category content */}
        <CategoryContent categoryName={categoryName} listingCount={totalCount} />

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
  } catch (error) {
    console.error("CategoryPage error:", error);
    return notFound();
  }
}
