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
import { generateSlugFromListing } from "@/lib/slug-utils";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, GlobeIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ListingCardClientProps {
  listing: Listing;
  className?: string;
}

export function ListingCardClient({
  listing,
  className,
}: ListingCardClientProps) {
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [ratingLoading, setRatingLoading] = useState(true);

  const slug = listing.slug || generateSlugFromListing(listing);

  const categories = listing.categories || [];
  const ageRange = listing.age_range || [];

  // Filter out UUIDs from categories
  const isUuidLike = (value: string | undefined): boolean => {
    if (!value) return false;
    return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
      value.trim(),
    );
  };

  const validCategories = categories.filter((cat) => !isUuidLike(cat));

  // Get average rating if reviews are enabled
  useEffect(() => {
    const fetchRating = async () => {
      if (isReviewsEnabled()) {
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
        "h-full flex flex-col bg-cream border-cream hover:shadow-tomato-red/10",
        className,
      )}
    >
      <CardHeader className="relative p-0">
        {/* Profile Image */}
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          {listing.profile_image ? (
            <Image
              src={listing.profile_image}
              alt={`Logo of ${listing.listing_name}`}
              title={`Logo of ${listing.listing_name}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Icons.studio className="h-12 w-12 text-paper" />
            </div>
          )}

          {/* Plan Badge */}
          <div className="absolute top-2 left-2">
            {(() => {
              // Determine badge text and styling
              let badgeText = "Free";
              let badgeClassName =
                "text-xs font-medium bg-gray-100 text-paper dark:bg-gray-900 dark:text-paper";

              if (listing.featured) {
                badgeText = "Featured";
                badgeClassName = "text-xs font-medium bg-tomato-red text-cream";
              } else if (listing.comped) {
                badgeText = "Pro";
                badgeClassName = "text-xs font-medium bg-retro-blue text-cream";
              } else if (
                (listing.plan || "").toLowerCase() === "pro" ||
                (listing.plan || "").toLowerCase() === "founding pro"
              ) {
                badgeText = "Pro";
                badgeClassName = "text-xs font-medium bg-retro-blue text-cream";
              } else if (
                (listing.plan || "").toLowerCase() === "standard" ||
                (listing.plan || "").toLowerCase() === "founding standard"
              ) {
                badgeText = "Standard";
                badgeClassName =
                  "text-xs font-medium bg-mustard-gold text-cream";
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
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium"
              >
                <CheckCircleIcon className="h-3 w-3 mr-1" />
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

        {/* Categories */}
        {validCategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {validCategories.slice(0, 2).map((category) => (
              <Badge
                key={category}
                variant="outline"
                className="text-xs font-normal border-retro-blue text-retro-blue"
              >
                {category}
              </Badge>
            ))}
            {validCategories.length > 2 && (
              <Badge
                variant="outline"
                className="text-xs font-normal border-retro-blue text-retro-blue"
              >
                +{validCategories.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Age Range */}
        {ageRange.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {ageRange.slice(0, 3).map((age) => (
              <Badge
                key={age}
                variant="outline"
                className="text-xs font-normal bg-mustard-gold/10 text-mustard-gold border-mustard-gold"
              >
                {age}
              </Badge>
            ))}
            {ageRange.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs font-normal bg-mustard-gold/10 text-mustard-gold border-mustard-gold"
              >
                +{ageRange.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
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
          <Button
            size="sm"
            asChild
            className="bg-tomato-red hover:bg-tomato-red/90 text-cream"
          >
            <Link href={`/listing/${slug}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
