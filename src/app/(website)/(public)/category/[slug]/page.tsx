export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import Container from "@/components/container";
import CategoryClient from "@/components/directory/CategoryClient";
import EmptyGrid from "@/components/shared/empty-grid";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
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
    const { totalCount } = await getItems({
      category: category.category_name,
      currentPage: 1,
      excludeFeatured: false,
    });
    const count = totalCount;

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

    // Get listings for this category using the same method as directory page
    const currentPage = 1;
    const { items, totalCount } = await getItems({
      category: categoryName,
      currentPage,
      excludeFeatured: false, // Show featured listings on category pages
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // DEBUG: Log raw query results
    console.log(`[CategoryPage:${params.slug}] Total listings returned:`, totalCount);
    console.log(`[CategoryPage:${params.slug}] Items on page 1:`, items.length);
    console.log(`[CategoryPage:${params.slug}] Sample data:`, items.slice(0, 3));

    // Generate category subtext (1 line, factual)
    const getCategorySubtext = (name: string): string => {
      const lower = name.toLowerCase();
      if (lower.includes("coach") || lower.includes("class")) {
        return "Professionals experienced with young performers in TV, film, and commercial work.";
      }
      if (lower.includes("photographer")) {
        return "Professional headshot photographers specializing in child and teen actors.";
      }
      if (lower.includes("agent") || lower.includes("manager")) {
        return "Talent representation for young actors in television, film, and commercial work.";
      }
      return "Professionals experienced with young performers in TV, film, and commercial work.";
    };

    return (
      <div className="flex flex-col bg-bg-dark min-h-screen">
        {/* Category Header - Only context above the grid */}
        <Container className="py-8">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-semibold text-text-primary mb-3">
              {categoryName} for Kids & Teens
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              {getCategorySubtext(categoryName)}
            </p>
            <p className="text-sm text-text-muted mt-2">
              {totalCount} verified {categoryName.toLowerCase()} serving young actors
            </p>
          </div>
        </Container>

        {/* Listings Grid - EXACT SAME as directory page */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="bauhaus-heading text-2xl text-white mb-4">
              All {categoryName}
              <span className="text-white/50 text-lg font-normal ml-2">
                ({totalCount} results)
              </span>
            </h2>
          </div>

          {/* when no items are found */}
          {items?.length === 0 && <EmptyGrid />}

          {/* when items are found - use client component for Load More (EXACT SAME as directory) */}
          {items && items.length > 0 && (
            <CategoryClient
              initialItems={items}
              initialTotalCount={totalCount}
              initialTotalPages={totalPages}
              categoryName={categoryName}
            />
          )}
        </section>
      </div>
    );
  } catch (error) {
    console.error("CategoryPage error:", error);
    return notFound();
  }
}
