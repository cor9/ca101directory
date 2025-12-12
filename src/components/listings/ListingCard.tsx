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
import { getCategoryIconsMap } from "@/data/categories";
import type { Listing } from "@/data/listings";
import { getListingAverageRating } from "@/data/reviews";
import { getCategoryIconUrl, getListingImageUrl } from "@/lib/image-urls";
import { generateSlugFromListing } from "@/lib/slug-utils";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, GlobeIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ListingCardProps {
  listing: Listing;
  className?: string;
}

export async function ListingCard({ listing, className }: ListingCardProps) {
  const slug = listing.slug || generateSlugFromListing(listing);

  console.log("ListingCard: Generated slug:", {
    listingName: listing.listing_name,
    slug,
    href: `/listing/${slug}`,
    listingId: listing.id,
  });

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
  let averageRating = { average: 0, count: 0 };
  if (isReviewsEnabled()) {
    try {
      averageRating = await getListingAverageRating(listing.id);
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  }

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

  // Determine primary image or fallback to category icon for free/unclaimed without profile image
  const needsCategoryFallback =
    !listing.profile_image && (!listing.is_claimed || listing.plan === "Free");
  let fallbackCategoryUrl: string | null = null;
  if (needsCategoryFallback) {
    try {
      const iconMap = await getCategoryIconsMap();
      const normalize = (v: string) =>
        v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      for (const cat of validCategories) {
        const entry = Object.entries(iconMap || {}).find(
          ([name]) => normalize(name) === normalize(cat),
        );
        if (entry?.[1]) {
          fallbackCategoryUrl = getCategoryIconUrl(entry[1]);
          break;
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // Determine badge text and styling
  let badgeText = "Free";
  let badgeColor = "bg-bg-3";
  if (listing.featured) {
    badgeText = "Featured";
    badgeColor = "bg-primary-orange";
  } else if (listing.comped) {
    badgeText = "Pro";
    badgeColor = "bg-primary-orange";
  } else if (
    (listing.plan || "").toLowerCase() === "pro" ||
    (listing.plan || "").toLowerCase() === "founding pro"
  ) {
    badgeText = "Pro";
    badgeColor = "bg-primary-orange";
  } else if (
    (listing.plan || "").toLowerCase() === "standard" ||
    (listing.plan || "").toLowerCase() === "founding standard"
  ) {
    badgeText = "Standard";
    badgeColor = "bg-highlight";
  }

  const isProFeatured = listing.featured || listing.comped || planPriority >= 3;

  return (
    <Card
      className={cn(
        "group bg-card-surface border border-border-subtle rounded-card overflow-hidden shadow-card hover:shadow-cardHover hover:-translate-y-0.5 transition-all duration-300",
        isProFeatured && "ring-1 ring-accent-teal/30",
        className,
      )}
    >
      {/* Image Area - Hero */}
      <div className="relative h-44 w-full bg-bg-2">
        {(listing.profile_image || fallbackCategoryUrl) && (
          <Image
            src={
              listing.profile_image
                ? getListingImageUrl(listing.profile_image)
                : fallbackCategoryUrl || ""
            }
            alt={listing.listing_name || "Listing"}
            fill
            className="object-cover"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {/* Left badges */}
          <div className="flex gap-2">
            {listing.featured && (
              <Badge
                className={cn(
                  "text-xs font-semibold",
                  badgeColor,
                  badgeColor === "bg-primary-orange"
                    ? "text-text-primary"
                    : "text-text-primary",
                )}
              >
                {badgeText}
              </Badge>
            )}
            {!listing.featured && planPriority >= 3 && (
              <Badge
                className={cn(
                  "text-xs font-semibold",
                  badgeColor,
                  badgeColor === "bg-primary-orange"
                    ? "text-text-primary"
                    : "text-text-primary",
                )}
              >
                {badgeText}
              </Badge>
            )}
          </div>

          {/* Right badges */}
          <div className="flex gap-2">
            {listing.badge_approved === true && (
              <Badge className="text-xs font-semibold bg-accent-teal text-bg-dark">
                <CheckCircleIcon className="w-3 h-3 mr-1" />
                101 Approved
              </Badge>
            )}
            {isReviewsEnabled() &&
              averageRating.count > 0 &&
              averageRating.average >= 4.5 && (
                <Badge className="text-xs font-semibold bg-highlight text-text-primary">
                  <StarIcon className="w-3 h-3 mr-1" />
                  {averageRating.average.toFixed(1)}
                </Badge>
              )}
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary line-clamp-1 group-hover:text-accent-teal transition-colors">
          {listing.listing_name || "Untitled Listing"}
        </h3>

        {/* Category */}
        {validCategories.length > 0 && (
          <div className="text-sm text-accent-teal font-medium">
            {validCategories[0]}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-text-secondary line-clamp-2">
          {(listing.what_you_offer || "Professional acting services")
            .replace(/<[^>]*>/g, "")
            .substring(0, 120)}
          {(listing.what_you_offer || "").replace(/<[^>]*>/g, "").length >
            120 && "..."}
        </p>

        {/* Location - Always shown if present */}
        {(listing.city || listing.state || listing.region) && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <MapPinIcon className="w-3 h-3" />
            <span>
              {[listing.city, listing.state, listing.region]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        {/* Rating */}
        {isReviewsEnabled() && averageRating.count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <StarRating
              value={Math.round(averageRating.average)}
              readonly
              size="sm"
            />
            <span className="text-text-secondary">
              {averageRating.average.toFixed(1)} ({averageRating.count} review
              {averageRating.count !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2">
            {listing.website && (
              <Button
                size="sm"
                variant="ghost"
                asChild
                className="text-text-secondary hover:text-text-primary"
              >
                <Link
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <GlobeIcon className="w-4 h-4" />
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
            className="w-full rounded-xl bg-accent-teal text-bg-dark font-semibold hover:opacity-90"
          >
            <Link href={`/listing/${slug}`}>View Profile</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
