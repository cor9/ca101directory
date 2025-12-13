"use client";

import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Icons } from "@/components/icons/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { isFavoritesEnabled, isReviewsEnabled } from "@/config/feature-flags";
import type { Listing } from "@/data/listings";
import { getListingAverageRating } from "@/data/reviews";
import { getListingImageUrl } from "@/lib/image-urls";
import { generateSlugFromListing } from "@/lib/slug-utils";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, GlobeIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ListingCardClientProps {
  listing: Listing;
  className?: string;
  isFeatured?: boolean;
}

export function ListingCardClient({
  listing,
  className,
  isFeatured = false,
}: ListingCardClientProps) {
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [ratingLoading, setRatingLoading] = useState(true);

  const slug = listing.slug || generateSlugFromListing(listing);

  const categories = listing.categories || [];
  const ageRange = listing.age_range || [];

  // Filter out UUIDs from categories
  const isUuidLike = (value: unknown): boolean => {
    if (typeof value !== "string") return false;
    return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
      value.trim(),
    );
  };

  // Normalize categories to string[] before filtering
  const normalizedCategories = (categories || []).filter(
    (cat): cat is string => typeof cat === "string",
  );

  const validCategories = normalizedCategories.filter(
    (cat) => !isUuidLike(cat),
  );

  // Get average rating if reviews are enabled
  useEffect(() => {
    const fetchRating = async () => {
      if (isReviewsEnabled() && listing.id) {
        try {
          const rating = await getListingAverageRating(listing.id);
          setAverageRating(rating);
        } catch (error) {
          console.error("Error fetching rating:", error);
        } finally {
          setRatingLoading(false);
        }
      } else {
        setRatingLoading(false);
      }
    };

    fetchRating();
  }, [listing.id]);

  // Plan-based sorting priority (Featured > Pro > Standard > Free)
  const getPlanPriority = (plan: string | null, comped: boolean | null) => {
    if (comped) return 3; // Comped listings are treated as Pro
    const p = (plan || "free").toLowerCase();
    switch (p) {
      case "pro":
      case "founding pro":
        return 3;
      case "standard":
      case "founding standard":
        return 2;
      case "free":
        return 1;
      default:
        return 0; // null/undefined plans default to Free
    }
  };

  const planPriority = getPlanPriority(listing.plan, listing.comped);

  return (
    <Card
      className={cn(
        "h-full flex flex-col bg-card-surface border border-border-subtle rounded-xl shadow-card hover:shadow-cardHover transition-all duration-300",
        // STEP 8: Featured listings - subtle elevation
        isFeatured && "ring-1 ring-accent-purple/40",
        className,
      )}
    >
      <CardHeader className="relative p-0">
        {/* STEP 4: Profile Image - fixed height, rounded top */}
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-t-xl bg-bg-dark-2",
            isFeatured ? "h-56" : "h-40",
          )}
        >
          {listing.profile_image ? (
            <Image
              src={getListingImageUrl(listing.profile_image)}
              alt={`Logo of ${listing.listing_name}`}
              title={`Logo of ${listing.listing_name}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Icons.studio className="h-12 w-12 text-text-primary" />
            </div>
          )}

          {/* Plan Badge */}
          <div className="absolute top-2 left-2">
            {(() => {
              // Determine badge text and styling
              let badgeText = "Free";
              let badgeClassName =
                "text-xs font-medium bg-gray-100 text-text-primary dark:bg-gray-900 dark:text-text-primary";

              if (listing.featured) {
                badgeText = "Featured";
                badgeClassName =
                  "text-xs font-medium bg-bg-3 text-text-secondary border border-accent-purple/40";
              } else if (listing.comped) {
                badgeText = "Pro";
                badgeClassName =
                  "text-xs font-medium bg-bg-3 text-text-secondary border border-border-subtle";
              } else if (
                (listing.plan || "").toLowerCase() === "pro" ||
                (listing.plan || "").toLowerCase() === "founding pro"
              ) {
                badgeText = "Pro";
                badgeClassName =
                  "text-xs font-medium bg-bg-3 text-text-secondary border border-border-subtle";
              } else if (
                (listing.plan || "").toLowerCase() === "standard" ||
                (listing.plan || "").toLowerCase() === "founding standard"
              ) {
                badgeText = "Standard";
                badgeClassName =
                  "text-xs font-medium bg-bg-3 text-text-secondary border border-border-subtle";
              }

              return (
                <Badge variant="secondary" className={badgeClassName}>
                  {badgeText}
                </Badge>
              );
            })()}
          </div>

          {/* 101 Approved Badge */}
          {listing.is_approved_101 === true && (
            <div className="absolute top-2 right-2">
              <Badge className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-gold/20 text-accent-gold text-xs font-semibold">
                <CheckCircleIcon className="w-3 h-3" />
                101 Approved
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-charcoal">
          {listing.listing_name}
        </h3>

        <div className="text-charcoal/70 text-sm line-clamp-2 mb-4">
          {(listing.what_you_offer || "Professional acting services")
            .replace(/<[^>]*>/g, "")
            .substring(0, 120)}
          ...
        </div>

        {/* Location */}
        {(listing.city || listing.state || listing.region) && (
          <div className="flex items-center gap-2 text-sm text-charcoal/60 mb-3">
            <MapPinIcon className="w-4 h-4" />
            <span>
              {[listing.city, listing.state, listing.region]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        {/* Rating */}
        {isReviewsEnabled() && !ratingLoading && averageRating.count > 0 && (
          <div className="flex items-center gap-2 text-sm mb-3">
            <StarRating
              value={Math.round(averageRating.average)}
              readonly
              size="sm"
            />
            <span className="text-charcoal/60">
              {averageRating.average.toFixed(1)} ({averageRating.count} review
              {averageRating.count !== 1 ? "s" : ""})
            </span>
          </div>
        )}

        {/* STEP 5: Categories - readable, scannable */}
        {validCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {validCategories.slice(0, 2).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="text-sm font-medium text-accent-blue border-accent-blue/30"
              >
                {category}
              </Badge>
            ))}
            {validCategories.length > 2 && (
              <Badge
                variant="outline"
                className="text-sm font-medium text-accent-blue border-accent-blue/30"
              >
                +{validCategories.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Age Range - remove Bauhaus colors */}
        {ageRange.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ageRange.slice(0, 3).map((age) => (
              <Badge
                key={age}
                variant="outline"
                className="text-xs font-normal bg-bg-3 text-text-muted border-border-subtle"
              >
                {age}
              </Badge>
            ))}
            {ageRange.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs font-normal bg-bg-3 text-text-muted border-border-subtle"
              >
                +{ageRange.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {listing.website && (
              <Button size="sm" variant="outline" asChild>
                <Link
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <GlobeIcon className="w-3 h-3" />
                  Website
                </Link>
              </Button>
            )}
            {isFavoritesEnabled() && (
              <FavoriteButton
                listingId={listing.id}
                listingName={listing.listing_name}
                size="sm"
                variant="ghost"
              />
            )}
          </div>
          {/* STEP 7: CTA hierarchy - real button */}
          <Button
            size="sm"
            asChild
            className="bg-accent-teal hover:opacity-90 text-bg-dark"
          >
            <Link href={`/listing/${slug}`}>View Details</Link>
          </Button>
        </div>

        {/* Claim status micro-copy */}
        <div className="text-xs text-charcoal/60">
          {listing.is_claimed || (listing.plan && listing.plan !== "Free")
            ? "Listing claimed and maintained by the professional."
            : !listing.is_claimed
              ? "This listing has not been claimed by the professional."
              : null}
        </div>
      </CardFooter>
    </Card>
  );
}
