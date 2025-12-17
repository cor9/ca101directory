import Container from "@/components/container";
import { DirectoryFilters } from "@/components/directory/directory-filters";
import HomeSearchBox from "@/components/home/home-search-box";
import { ListingCard } from "@/components/listings/ListingCard";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import {
  getPublicListings,
  sortSearchResultsByPriority,
} from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "Search Directory - Find Acting Professionals for Child Actors",
  description:
    "Search our directory of 250+ trusted acting coaches, headshot photographers, talent agents, and managers for child actors. Filter by location, category, and specialty to find the perfect professional for your child's acting career.",
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
    online_available,
    age_groups,
  } = searchParams as { [key: string]: string };

  // Get all listings matching search query
  const allListings = await getPublicListings({
    q: query,
    category,
    state,
    region,
    online_available: online_available === "true",
    age_groups: age_groups ? age_groups.split(",") : undefined,
  });

  // Sort by search priority
  const sortedListings = query
    ? sortSearchResultsByPriority(allListings, query)
    : allListings;

  // 17A: Top 2 slots per search = Pro only (highest intent surface)
  const featuredProviders = sortedListings
    .filter((l) => {
      const plan = (l.plan || "").toLowerCase();
      return (
        plan.includes("pro") ||
        plan.includes("premium") ||
        l.comped ||
        l.featured
      );
    })
    .slice(0, 2);

  // Separate other best matches (paid, max 3) from other results
  const bestMatches = sortedListings
    .filter(
      (l) =>
        l.plan &&
        l.plan !== "Free" &&
        l.plan !== null &&
        !featuredProviders.some((fp) => fp.id === l.id),
    )
    .slice(0, 3);
  const otherResults = sortedListings.slice(
    featuredProviders.length + bestMatches.length,
  );

  // Get query clarification for vague terms
  const getQueryClarification = (q: string | undefined): string | null => {
    if (!q) return null;
    const qLower = q.toLowerCase();
    if (qLower.includes("coach")) {
      return "Showing acting coaches, audition coaches, and related services.";
    }
    if (qLower.includes("photo") || qLower.includes("headshot")) {
      return "Showing headshot photographers and related services.";
    }
    if (qLower.includes("agent") || qLower.includes("manager")) {
      return "Showing talent agents, managers, and related services.";
    }
    return null;
  };

  const clarification = getQueryClarification(query);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
          {query ? `Search Results for "${query}"` : "Search Professionals"}
        </h1>

        {/* Search Box */}
        <div className="max-w-2xl mb-4">
          <HomeSearchBox urlPrefix="/search" />
        </div>

        {/* 15H: Microcopy */}
        <p className="text-sm text-text-muted mt-2">
          Most families compare 2–3 providers before reaching out.
        </p>
      </div>

      {/* 15D: Query Clarification */}
      {clarification && (
        <div className="mb-6 pb-4 border-b border-border-subtle">
          <p className="text-sm text-text-secondary italic">{clarification}</p>
        </div>
      )}

      {/* 15E: Zero Results */}
      {sortedListings.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-text-primary mb-4">
              We don't have an exact match yet
            </h3>
            <p className="text-text-secondary mb-6">
              Try a different search term or explore categories.
            </p>
            <div className="space-y-4">
              {categories.length > 0 && (
                <div>
                  <p className="text-sm text-text-muted mb-3">
                    Explore categories:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {categories.slice(0, 4).map((cat) => {
                      const slug = cat.category_name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "");
                      return (
                        <Link
                          key={cat.id}
                          href={`/category/${slug}`}
                          className="text-sm text-accent-teal hover:text-accent-teal/80 transition-colors"
                        >
                          {cat.category_name} →
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
              <div>
                <Link
                  href="/suggest-vendor"
                  className="inline-block text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  Suggest a provider →
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <section>
          {/* 17A: Featured Providers - Top 2 slots = Pro only */}
          {featuredProviders.length > 0 && query && (
            <div className="mb-12">
              <p className="text-sm text-text-muted mb-4">Featured providers</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredProviders.map((listing) => (
                  <div key={listing.id} className="relative">
                    <div className="absolute -inset-0.5 bg-accent-purple/20 rounded-lg blur-sm opacity-50" />
                    <div className="relative">
                      <ListingCard listing={listing} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 15C: Best Matches */}
          {bestMatches.length > 0 && query && (
            <div
              className={
                featuredProviders.length > 0
                  ? "mt-12 pt-12 border-t border-border-subtle"
                  : "mb-12"
              }
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-6">
                Best matches
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bestMatches.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}

          {/* Other Results */}
          {otherResults.length > 0 && (
            <div
              className={
                bestMatches.length > 0
                  ? "mt-12 pt-12 border-t border-border-subtle"
                  : ""
              }
            >
              <h2 className="text-2xl font-semibold text-text-primary mb-6">
                {bestMatches.length > 0 ? "Other results" : "All results"} (
                {sortedListings.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherResults.map((listing) => {
                  const isFree =
                    !listing.plan ||
                    listing.plan === "Free" ||
                    listing.plan === null;
                  return (
                    <div
                      key={listing.id}
                      className={isFree ? "opacity-75" : ""}
                    >
                      <ListingCard listing={listing} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
