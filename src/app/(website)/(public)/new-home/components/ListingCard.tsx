import Image from "next/image";

import Link from "next/link";

import { MapPin, Star } from "lucide-react";
import { ProfileVerifiedBadge } from "@/components/badges/ProfileVerifiedBadge";
import { CategoryPlaceholder } from "@/components/listing/CategoryPlaceholder";

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

    profile_verified?: boolean;

    profile_verified_at?: string | null;

    image_url?: string;

    logo_url?: string;

    rating?: number;

    review_count?: number;

    tags?: string[];
  };

  variant?: "default" | "compact" | "featured";
}

export default function ListingCard({
  listing,

  variant = "default",
}: ListingCardProps) {
  const listingName = listing.title || listing.name || "Listing";

  const listingCategory =
    listing.category || listing.category_name || "Professional";

  const listingLocation =
    listing.city && listing.state
      ? `${listing.city}, ${listing.state}`
      : listing.location || "";

  const listingImage = listing.image_url || listing.logo_url;

  const listingSlug = listing.slug || listing.id;

  if (variant === "compact") {
    return (
      <Link
        href={`/item/${listingSlug}`}
        className="flex items-center gap-4 p-3 bg-card-surface border border-border-subtle rounded-xl hover-glow transition group"
      >
        {/* Thumbnail */}

        <div className="relative w-16 h-16 flex-shrink-0 bg-bg-dark-2 rounded-lg overflow-hidden">
          {listingImage ? (
            <Image
              src={listingImage}
              alt={listingName}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <CategoryPlaceholder category={listingCategory} size="sm" showLabel={false} />
          )}
        </div>

        {/* Info */}

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text-primary truncate  transition">
            {listingName}
          </h3>

          <p className="text-xs text-text-muted truncate">{listingCategory}</p>
        </div>

        {(listing.profile_verified || listing.is_verified) && (
          <ProfileVerifiedBadge profileVerifiedAt={listing.profile_verified_at} />
        )}
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/item/${listingSlug}`}
        className="block bg-card-surface border border-border-subtle rounded-2xl overflow-hidden hover-glow transition group"
      >
        {/* Featured Image */}

        <div className="relative h-56 w-full bg-bg-dark-2">
          {listingImage ? (
            <Image
              src={listingImage}
              alt={listingName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <CategoryPlaceholder category={listingCategory} size="lg" className="h-56" />
          )}

          {/* Featured Badge */}

          {listing.is_featured && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-bg-3 text-text-secondary border border-accent-purple/40 font-semibold text-xs rounded-full">
              Featured
            </div>
          )}

          {/* Profile Verified Badge */}

          {(listing.profile_verified || listing.is_verified) && (
            <div className="absolute top-3 right-3">
              <ProfileVerifiedBadge profileVerifiedAt={listing.profile_verified_at} />
            </div>
          )}
        </div>

        {/* Content */}

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-xl font-semibold text-text-primary truncate  transition">
                {listingName}
              </h3>

              <p className="text-sm text-accent-blue mt-1">{listingCategory}</p>
            </div>

            {listing.rating && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 text-accent-gold fill-accent-gold" />

                <span className="text-sm font-medium text-text-primary">
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

          {listing.description && (
            <p className="mt-3 text-sm text-text-secondary line-clamp-2">
              {listing.description}
            </p>
          )}

          {listingLocation && (
            <div className="flex items-center gap-1 mt-3 text-sm text-text-muted">
              <MapPin className="w-4 h-4" />

              <span>{listingLocation}</span>
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

  // Default variant

  return (
    <Link
      href={`/item/${listingSlug}`}
      className="block bg-card-surface border border-border-subtle rounded-xl overflow-hidden hover-glow transition group"
    >
      {/* Image */}

      <div className="relative h-40 w-full bg-bg-dark-2">
        {listingImage ? (
          <Image
            src={listingImage}
            alt={listingName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <CategoryPlaceholder category={listingCategory} size="md" className="h-40" />
        )}

        {/* Profile Verified Badge */}

        {(listing.profile_verified || listing.is_verified) && (
          <div className="absolute top-2 right-2">
            <ProfileVerifiedBadge profileVerifiedAt={listing.profile_verified_at} />
          </div>
        )}
      </div>

      {/* Content */}

      <div className="p-4">
        <h3 className="font-semibold text-text-primary truncate  transition">
          {listingName}
        </h3>

        <p className="text-sm text-accent-blue mt-0.5">{listingCategory}</p>

        {listingLocation && (
          <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
            <MapPin className="w-3 h-3" />

            <span>{listingLocation}</span>
          </div>
        )}

        {listing.rating && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3 h-3 text-accent-gold fill-accent-gold" />

            <span className="text-xs font-medium text-text-primary">
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
