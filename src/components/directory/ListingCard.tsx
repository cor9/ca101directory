"use client";

import { BadgeStack } from "@/components/badges/StatusBadge";
import { CheckCircle, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ListingCardProps {
  listing: {
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
  };
  variant?: "default" | "compact" | "featured";
}

/** Category Color Map (matches Patreon-style UI kit) */
const categoryColors: Record<string, string> = {
  Photographer: "from-accent-purple to-accent-blue",
  "Acting Coach": "from-accent-teal to-accent-lemon",
  Studio: "from-accent-salmon to-accent-purple",
  Editor: "from-accent-lemon to-accent-blue",
};

export default function ListingCard({
  listing,
  variant = "default",
}: ListingCardProps) {
  const listingName = listing.title || listing.name || "Listing";
  const category = listing.category || listing.category_name || "Professional";

  const location =
    listing.city && listing.state
      ? `${listing.city}, ${listing.state}`
      : listing.location || "";

  const image = listing.image_url || listing.logo_url;
  const slug = listing.slug || listing.id;

  const headerGradient =
    categoryColors[category] || "from-accent-blue/60 to-accent-purple/60";

  /** COMPACT VARIANT — used inside mixed grids / sidebars */
  if (variant === "compact") {
    return (
      <Link
        href={`/item/${slug}`}
        className="flex items-center gap-4 p-3 rounded-xl bg-bg-dark-2 border border-border-subtle hover-glow transition group"
      >
        {/* Thumbnail */}
        <div className="relative w-16 h-16 flex-shrink-0 bg-bg-dark rounded-lg overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={listingName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-blue to-accent-purple text-text-muted font-bold text-lg">
              {listingName.charAt(0)}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text-primary truncate">
            {listingName}
          </h3>
          <p className="text-xs text-text-muted truncate">{category}</p>
        </div>

        {listing.is_verified && (
          <CheckCircle className="w-4 h-4 text-accent-gold" />
        )}
      </Link>
    );
  }

  /** FEATURED VARIANT */
  if (variant === "featured") {
    return (
      <Link
        href={`/item/${slug}`}
        className="rounded-2xl overflow-hidden bg-bg-dark-2 border border-border-subtle hover-glow transition block group"
      >
        {/* Hero Image */}
        <div className="relative h-56 w-full bg-bg-dark">
          {image ? (
            <Image
              src={image}
              alt={listingName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-accent-purple to-accent-blue text-5xl font-bold text-text-muted">
              {listingName.charAt(0)}
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <BadgeStack
              verified={!!listing.is_verified}
              featured={!!listing.is_featured}
              pro={false}
              maxBadges={2}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-semibold text-text-primary truncate">
            {listingName}
          </h3>
          <p className="text-sm text-accent-blue mt-1">{category}</p>

          {/* Rating */}
          {listing.rating && (
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 text-accent-gold fill-accent-gold" />
              <span className="text-sm text-text-primary font-medium">
                {listing.rating.toFixed(1)}
              </span>
              {listing.review_count && (
                <span className="text-xs text-text-muted">
                  ({listing.review_count})
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <p className="text-sm text-text-secondary mt-3 line-clamp-2">
              {listing.description}
            </p>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1 mt-3 text-sm text-text-muted">
              <MapPin className="w-4 h-4" /> {location}
            </div>
          )}

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {listing.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-bg-dark-3 text-text-muted rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  }

  /** DEFAULT VARIANT — Your new standard Patreon-style tile */
  return (
    <Link
      href={`/item/${slug}`}
      className="rounded-xl overflow-hidden bg-bg-dark-2 border border-border-subtle hover-glow transition block group shadow-card"
    >
      {/* Category Header Bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${headerGradient}`} />

      {/* Image */}
      <div className="relative h-44 w-full bg-bg-dark">
        {image ? (
          <Image
            src={image}
            alt={listingName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-accent-purple to-accent-blue text-4xl font-bold text-text-muted">
            {listingName.charAt(0)}
          </div>
        )}

        {listing.is_verified && (
          <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-semibold shadow">
            <CheckCircle className="w-3 h-3" /> Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-text-primary truncate">
          {listingName}
        </h3>

        <p className="text-sm text-accent-blue font-medium">{category}</p>

        {location && (
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <MapPin className="w-3 h-3" />
            {location}
          </div>
        )}

        {listing.rating && (
          <div className="flex items-center gap-1 pt-1">
            <Star className="w-3 h-3 text-accent-gold fill-accent-gold" />
            <span className="text-xs text-text-primary font-semibold">
              {listing.rating.toFixed(1)}
            </span>
            {listing.review_count && (
              <span className="text-xs text-text-muted">
                ({listing.review_count})
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
