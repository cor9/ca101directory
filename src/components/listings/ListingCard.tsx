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
import { cn } from "@/lib/utils";
import { CheckCircleIcon, GlobeIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ListingCardProps {
  listing: Listing;
  className?: string;
}

export async function ListingCard({ listing, className }: ListingCardProps) {
  const slug =
    listing.listing_name
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || listing.id;
  
  console.log("ListingCard: Generated slug:", {
    listingName: listing.listing_name,
    slug,
    href: `/listing/${slug}`,
    listingId: listing.id
  });

  const categories = listing.categories?.split(",").map((c) => c.trim()) || [];
  const ageRange = listing.age_range?.split(",").map((a) => a.trim()) || [];

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

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 border-border",
        planPriority >= 3 && "ring-1 ring-brand-orange/20",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {listing.profile_image && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={listing.profile_image}
                  alt={listing.listing_name || "Listing"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-card-foreground group-hover:text-brand-blue transition-colors line-clamp-1">
                {listing.listing_name || "Untitled Listing"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {listing.approved_101_badge === "checked" && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 text-xs"
                  >
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    101 Approved
                  </Badge>
                )}
                {(() => {
                  // Determine badge text and styling
                  let badgeText = 'Free';
                  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
                  let badgeClassName = "text-xs bg-gray-100 text-gray-600";

                  if (listing.comped) {
                    badgeText = 'Pro';
                    badgeVariant = "default";
                    badgeClassName = "text-xs bg-brand-blue text-white";
                  } else if (listing.plan === 'pro') {
                    badgeText = 'Pro';
                    badgeVariant = "default";
                    badgeClassName = "text-xs bg-brand-blue text-white";
                  } else if (listing.plan === 'standard') {
                    badgeText = 'Standard';
                    badgeVariant = "secondary";
                    badgeClassName = "text-xs bg-gray-100 text-gray-800";
                  } else if (listing.plan === 'premium') {
                    badgeText = 'Featured';
                    badgeVariant = "default";
                    badgeClassName = "text-xs bg-brand-orange text-white";
                  }

                  return (
                    <Badge
                      variant={badgeVariant}
                      className={badgeClassName}
                    >
                      {badgeText}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </div>
          {planPriority >= 3 && (
            <StarIcon className="w-5 h-5 text-brand-orange" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {listing.what_you_offer || "Professional acting services"}
        </p>

        {/* Location */}
        {(listing.city || listing.state || listing.region) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
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
            <StarRating value={Math.round(averageRating.average)} readonly size="sm" />
            <span className="text-muted-foreground">
              {averageRating.average.toFixed(1)} ({averageRating.count} review{averageRating.count !== 1 ? "s" : ""})
            </span>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{categories.length - 2} more
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
                className="text-xs bg-brand-blue/10 text-brand-blue"
              >
                {age}
              </Badge>
            ))}
            {ageRange.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs bg-brand-blue/10 text-brand-blue"
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
          <Button size="sm" asChild>
            <Link href={`/listing/${slug}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
