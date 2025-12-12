"use client";

import ListingCard from "./ListingCard";

interface Listing {
  id: string;

  slug?: string;

  title?: string;

  name?: string;

  description?: string;

  category?: string;

  category_name?: string;

  city?: string;

  state?: string;

  location?: string;

  is_verified?: boolean;

  is_featured?: boolean;

  image_url?: string;

  logo_url?: string;

  rating?: number;

  review_count?: number;

  tags?: string[];
}

interface ListingGridProps {
  listings: Listing[];

  variant?: "default" | "compact" | "featured";

  columns?: 2 | 3 | 4;

  isLoading?: boolean;

  emptyMessage?: string;
}

export default function ListingGrid({
  listings,

  variant = "default",

  columns = 3,

  isLoading = false,

  emptyMessage = "No listings found",
}: ListingGridProps) {
  // Loading skeleton

  if (isLoading) {
    const skeletonCount = columns * 2;

    return (
      <div
        className={`grid gap-6 ${
          columns === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : columns === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }`}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="bg-card-surface border border-border-subtle rounded-xl overflow-hidden animate-pulse"
          >
            <div className="h-40 bg-bg-dark-2" />

            <div className="p-4 space-y-3">
              <div className="h-5 bg-bg-dark-2 rounded w-3/4" />

              <div className="h-4 bg-bg-dark-2 rounded w-1/2" />

              <div className="h-3 bg-bg-dark-2 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state

  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-bg-dark-2 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        <p className="text-text-muted text-lg">{emptyMessage}</p>

        <p className="text-text-muted text-sm mt-1">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  // Compact variant uses a different layout

  if (variant === "compact") {
    return (
      <div className="space-y-3">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} variant="compact" />
        ))}
      </div>
    );
  }

  // Grid layout for default and featured variants

  const gridClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid gap-8 ${gridClass}`}>
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} variant={variant} />
      ))}
    </div>
  );
}
