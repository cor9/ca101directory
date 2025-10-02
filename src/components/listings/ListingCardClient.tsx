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
import { cn } from "@/lib/utils";
import { CheckCircleIcon, GlobeIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ListingCardClientProps {
  listing: Listing;
  className?: string;
}

export function ListingCardClient({ listing, className }: ListingCardClientProps) {
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [ratingLoading, setRatingLoading] = useState(true);

  const slug =
    listing.listing_name
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || listing.id;

  const categories = listing.categories?.split(",").map((c) => c.trim()) || [];
  const ageRange = listing.age_range?.split(",").map((a) => a.trim()) || [];

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

  // Plan-based sorting priority (Premium > Pro > Basic > Free)
  const getPlanPriority = (plan: string | null) => {
    switch (plan) {
      case "Premium":
        return 4;
      case "Pro":
        return 3;
      case "Basic":
        return 2;
      case "Free":
        return 1;
      default:
        return 0;
    }
  };

  const planPriority = getPlanPriority(listing.plan);

  return (
    <Card className={cn("h-full flex flex-col", className)}>
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
              <Icons.logo className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Plan Badge */}
          {listing.plan && (
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  listing.plan === "Premium" &&
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                  listing.plan === "Pro" &&
                    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                  listing.plan === "Basic" &&
                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                  listing.plan === "Free" &&
                    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
                )}
              >
                {listing.plan}
              </Badge>
            </div>
          )}

          {/* 101 Approved Badge */}
          {listing.approved_101_badge === "checked" && (
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
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {listing.listing_name}
        </h3>

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
        {isReviewsEnabled() && !ratingLoading && averageRating.count > 0 && (
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
              <Badge
                key={category}
                variant="secondary"
                className="text-xs font-normal"
              >
                {category}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{categories.length - 2}
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
                className="text-xs font-normal"
              >
                {age}
              </Badge>
            ))}
            {ageRange.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
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
