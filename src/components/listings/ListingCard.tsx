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
  const isUuidLike = (value: string | undefined): boolean => {
    if (!value) return false;
    return /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(
      value.trim(),
    );
  };

  const validCategories = categories.filter((cat) => !isUuidLike(cat));

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
    switch (plan) {
      case "premium":
        return 4;
      case "pro":
        return 3;
      case "standard":
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

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 surface border-surface/20",
        planPriority >= 3 && "ring-1 ring-primary-orange/20",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {(listing.profile_image || fallbackCategoryUrl) && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={
                    listing.profile_image
                      ? getListingImageUrl(listing.profile_image)
                      : fallbackCategoryUrl || ""
                  }
                  alt={listing.listing_name || "Listing"}
                  fill
                  className="object-contain p-1"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-lg group-hover:text-primary-orange transition-colors line-clamp-1"
                style={{ color: "#1B1F29" }}
              >
                {listing.listing_name || "Untitled Listing"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {listing.badge_approved === true && (
                  <div className="flex items-center gap-1">
                    <Image
                      src="/101approvedbadge.png"
                      alt="101 Approved Badge"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    <span className="text-xs font-semibold text-brand-orange">
                      101 Approved
                    </span>
                  </div>
                )}
                {(() => {
                  // Determine badge text and styling
                  let badgeText = "Free";
                  let badgeVariant:
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline" = "outline";
                  let badgeClassName = "text-xs bg-gray-100 text-surface";

                  if (listing.comped) {
                    badgeText = "Pro";
                    badgeVariant = "default";
                    badgeClassName = "text-xs bg-primary-orange text-paper";
                  } else if (listing.plan === "Pro") {
                    badgeText = "Pro";
                    badgeVariant = "default";
                    badgeClassName = "text-xs bg-primary-orange text-paper";
                  } else if (listing.plan === "Standard") {
                    badgeText = "Standard";
                    badgeVariant = "secondary";
                    badgeClassName = "text-xs bg-highlight text-ink";
                  } else if (listing.plan === "Premium") {
                    badgeText = "Featured";
                    badgeVariant = "default";
                    badgeClassName = "text-xs bg-primary-orange text-paper";
                  }

                  return (
                    <Badge variant={badgeVariant} className={badgeClassName}>
                      {badgeText}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </div>
          {planPriority >= 3 && (
            <StarIcon className="w-5 h-5 text-primary-orange" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="text-surface">
          {(listing.what_you_offer || "Professional acting services")
            .replace(/<[^>]*>/g, "")
            .substring(0, 120)}
          ...
        </div>

        {/* Location */}
        {(listing.city || listing.state || listing.region) && (
          <div className="flex items-center gap-2 text-sm mb-3 text-surface">
            <MapPinIcon className="w-4 h-4" />
            <span>
              {[listing.city, listing.state, listing.region]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        {/* Rating */}
        {isReviewsEnabled() && averageRating.count > 0 && (
          <div className="flex items-center gap-2 text-sm mb-3">
            <StarRating
              value={Math.round(averageRating.average)}
              readonly
              size="sm"
            />
            <span className="text-surface">
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
                className="text-xs border-secondary-denim text-secondary-denim"
              >
                {category}
              </Badge>
            ))}
            {validCategories.length > 2 && (
              <Badge
                variant="outline"
                className="text-xs border-secondary-denim text-secondary-denim"
              >
                +{validCategories.length - 2} more
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
                variant="secondary"
                className="text-xs bg-highlight/10 text-highlight"
              >
                {age}
              </Badge>
            ))}
            {ageRange.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs bg-highlight/10 text-highlight"
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
              <Button
                size="sm"
                variant="outline"
                asChild
                className="btn-secondary"
              >
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
          <Button size="sm" asChild className="btn-primary">
            <Link href={`/listing/${slug}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
