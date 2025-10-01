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
import { isFavoritesEnabled } from "@/config/feature-flags";
import type { Listing } from "@/data/listings";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, GlobeIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ListingCardProps {
  listing: Listing;
  className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const slug =
    listing["Listing Name"]
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || listing.id;

  const categories = listing.Categories?.split(",").map((c) => c.trim()) || [];
  const ageRange = listing["Age Range"]?.split(",").map((a) => a.trim()) || [];

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

  const planPriority = getPlanPriority(listing.Plan);

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
            {listing["Profile Image"] && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={listing["Profile Image"]}
                  alt={listing["Listing Name"] || "Listing"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-card-foreground group-hover:text-brand-blue transition-colors line-clamp-1">
                {listing["Listing Name"] || "Untitled Listing"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {listing["Approved 101 Badge"] === "checked" && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 text-xs"
                  >
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    101 Approved
                  </Badge>
                )}
                {listing.Plan && (
                  <Badge
                    variant={listing.Plan === "Premium" ? "default" : "outline"}
                    className={cn(
                      "text-xs",
                      listing.Plan === "Premium" &&
                        "bg-brand-orange text-white",
                      listing.Plan === "Pro" && "bg-brand-blue text-white",
                      listing.Plan === "Basic" && "bg-gray-100 text-gray-800",
                    )}
                  >
                    {listing.Plan}
                  </Badge>
                )}
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
          {listing["What You Offer?"] || "Professional acting services"}
        </p>

        {/* Location */}
        {(listing.City || listing.State || listing.Region) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPinIcon className="w-4 h-4" />
            <span>
              {[listing.City, listing.State, listing.Region]
                .filter(Boolean)
                .join(", ")}
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
            {listing.Website && (
              <Button size="sm" variant="outline" asChild>
                <Link
                  href={listing.Website}
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
