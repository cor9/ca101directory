export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingCardClient } from "@/components/listings/ListingCardClient";
import { CategoryContent } from "@/components/seo/category-content";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import {
  getFeaturedListingsByCategory,
  getPublicListings,
  sortListingsByPriority,
} from "@/data/listings";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";
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
        listing.is_active,
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

    // Get all listings for this category
    const allListings = await getPublicListings({ category: categoryName });
    
    // Get featured listings for this category (max 3)
    let featuredListings: typeof allListings = [];
    try {
      featuredListings = await getFeaturedListingsByCategory(categoryName);
    } catch (error) {
      console.error("Error fetching featured listings:", error);
    }

    // Sort all listings by priority: Pro > Standard > Free, then by photos, then updated
    const sortedListings = sortListingsByPriority(allListings);
    
    // Separate paid and free listings
    const paidListings = sortedListings.filter(
      (l) => l.plan && l.plan !== "Free" && l.plan !== null,
    );
    const freeListings = sortedListings.filter(
      (l) => !l.plan || l.plan === "Free" || l.plan === null,
    );

    // Get related categories for SEO links
    const relatedCategories = categories
      .filter((c) => c.category_name !== categoryName)
      .slice(0, 2);

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
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* 14A: Category Hero */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-text-primary mb-3">
            {categoryName} for Kids & Teens
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl">
            {getCategorySubtext(categoryName)}
          </p>
        </div>

        {/* 14B: Featured in This Category */}
        {featuredListings.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Featured in this category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* 14C: Smart Filters (placeholder for now - will be enhanced later) */}
        <div className="mb-6 pb-4 border-b border-border-subtle">
          <p className="text-sm text-text-muted italic">
            Tip: Families often start with 2–3 providers and compare approach,
            fit, and communication style.
          </p>
        </div>

        {/* 14E: SEO Intro Text */}
        <div className="mb-8">
          <CategoryContent
            categoryName={categoryName}
            listingCount={allListings.length}
          />
        </div>

        {/* 14D: All Listings - Paid first, then free */}
        {allListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                This category is growing
              </h3>
              <p className="text-text-secondary mb-4">
                We're actively adding vetted professionals.
              </p>
              {relatedCategories.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-text-muted mb-3">
                    Explore related categories:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {relatedCategories.map((related) => {
                      const relatedSlug = related.category_name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "");
                      return (
                        <Link
                          key={related.id}
                          href={`/category/${relatedSlug}`}
                          className="text-sm text-accent-teal hover:text-accent-teal/80 transition-colors"
                        >
                          {related.category_name} →
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="mt-6">
                <Link
                  href="/suggest-vendor"
                  className="inline-block text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Suggest a provider →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <section>
            {/* Paid Listings */}
            {paidListings.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-text-primary mb-6">
                  All {categoryName} ({paidListings.length + freeListings.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paidListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            )}

            {/* Free Listings - Visual downgrade */}
            {freeListings.length > 0 && (
              <div className={paidListings.length > 0 ? "mt-12 pt-12 border-t border-border-subtle" : ""}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {freeListings.map((listing) => (
                    <div key={listing.id} className="opacity-75">
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 14E: Related Categories Links */}
            {relatedCategories.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border-subtle">
                <p className="text-sm text-text-muted mb-4">
                  Many families looking for {categoryName.toLowerCase()} also
                  explore:
                </p>
                <div className="flex flex-wrap gap-4">
                  {relatedCategories.map((related) => {
                    const relatedSlug = related.category_name
                      .toLowerCase()
                      .replace(/[^a-z0-9\s]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "");
                    return (
                      <Link
                        key={related.id}
                        href={`/category/${relatedSlug}`}
                        className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                      >
                        {related.category_name} →
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error("CategoryPage error:", error);
    return notFound();
  }
}
