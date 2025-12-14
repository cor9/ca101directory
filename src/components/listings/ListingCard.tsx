import { BadgeStack } from "@/components/badges/StatusBadge";
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

  // Determine if listing is paid/claimed for subtle contrast
  const isPaidClaimed =
    listing.is_claimed || (listing.plan && listing.plan !== "Free");

  // 16A: Determine if Free listing
  const isFree =
    !listing.plan || listing.plan === "Free" || listing.plan === null;
  const isStandard =
    listing.plan &&
    (listing.plan.toLowerCase() === "standard" ||
      listing.plan.toLowerCase() === "founding standard");
  const isPro = planPriority >= 3;

  // 16D: Badge Economy - limit badges by tier
  // Determine badge states (using canonical fields only)
  const isVerified = listing.trust_level === "verified";
  const isFeatured = !!listing.featured;
  const isProBadge = isPro || !!listing.comped;

  const getMaxBadges = (): number => {
    if (isPro) return 2; // Max 2 badges (Verified + Pro)
    if (isStandard) return 2;
    return 1; // Free: max 1 badge
  };

  const maxBadges = getMaxBadges();

  return (
    <Card
      className={cn(
        "group bg-card-surface border border-border-subtle rounded-xl overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-300",
        // STEP 8: Featured listings - subtle elevation (accent-purple border)
        listing.featured && "ring-1 ring-accent-purple/40",
        isProFeatured && !listing.featured && "ring-1 ring-accent-purple/30",
        isPaidClaimed && !isProFeatured && "bg-bg-dark-2",
        // 16A: Free listings - smaller card, no image
        isFree && "opacity-90 scale-[0.98]",
        className,
      )}
    >
      {/* STEP 4: Image Area - Hero - fixed height, rounded top */}
      {/* 16A: Free listings get no image, Standard/Pro get image */}
      {!isFree && (
        <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-bg-dark-2">
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

          {/* Badges Overlay - Top-left placement */}
          <div className="absolute left-3 top-3 flex gap-2">
            <BadgeStack
              verified={isVerified}
              featured={isFeatured}
              pro={isProBadge}
              maxBadges={maxBadges}
            />
          </div>
        </div>
      )}

      {/* 16A: Free listings - show badges in content area instead */}
      {isFree && (isVerified || isFeatured || isProBadge) && (
        <div className="p-4 pb-2">
          <BadgeStack
            verified={isVerified}
            featured={isFeatured}
            pro={isProBadge}
            maxBadges={maxBadges}
          />
        </div>
      )}

      <CardContent className="p-4 space-y-2">
        {/* Title */}
        <h3 className="text-xl font-semibold text-text-primary line-clamp-1">
          {listing.listing_name || "Untitled Listing"}
        </h3>

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

        {/* STEP 5: Category label - readable, scannable */}
        {/* 16A: Free listings get muted category label */}
        {validCategories.length > 0 && (
          <p
            className={cn(
              "text-sm font-medium line-clamp-1",
              isFree ? "text-text-muted/70" : "text-accent-blue",
            )}
          >
            {validCategories[0]}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          {/* Rating - bottom left */}
          {isReviewsEnabled() && averageRating.count > 0 ? (
            <div className="flex items-center gap-1.5">
              <StarRating
                value={Math.round(averageRating.average)}
                readonly
                size="sm"
              />
              <span className="text-xs text-text-muted">
                {averageRating.average.toFixed(1)}
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* STEP 7: CTA hierarchy - real button, not ghost link */}
          {/* 16A: Free listings get "View Profile" only, Standard/Pro get "Contact" button */}
          {isFree ? (
            <Link
              href={`/listing/${slug}`}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium bg-accent-orange text-black hover:bg-accent-orange/90 transition-colors"
            >
              View Profile →
            </Link>
          ) : (
            <Link
              href={`/listing/${slug}`}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium bg-accent-orange text-black hover:bg-accent-orange/90 transition-colors"
            >
              Contact →
            </Link>
          )}
        </div>

        {/* Claim status micro-copy */}
        <div className="text-xs text-text-muted">
          {listing.is_claimed || (listing.plan && listing.plan !== "Free")
            ? "Listing claimed and maintained by the professional."
            : !listing.is_claimed
              ? "This listing has not been claimed by the professional."
              : null}
        </div>

        {/* 16B: Inline Upgrade Teaser for Free listings only */}
        {isFree && !listing.profile_image && (
          <div className="pt-2 border-t border-border-subtle">
            <p className="text-xs text-text-muted/70 mb-1">
              Listings with photos get 3× more clicks
            </p>
            <Link
              href={`/pricing?from=listing-card&listing=${listing.id}`}
              className="text-xs text-accent-teal hover:text-accent-teal/80 transition-colors"
            >
              Upgrade to add images →
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
