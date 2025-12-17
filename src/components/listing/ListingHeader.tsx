import type { Listing } from "@/data/listings";
import { getListingImageUrl } from "@/lib/image-urls";
import { ListingBadges } from "./ListingBadges";

interface ListingHeaderProps {
  listing: Listing;
  category: string;
  location: string;
  averageRating?: { average: number; count: number };
  hasVirtualOption: boolean;
}

function initialsFromName(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "CA";
}

export function ListingHeader({
  listing,
  category,
  location,
  averageRating,
  hasVirtualOption,
}: ListingHeaderProps) {
  const heroImageUrl = listing.profile_image
    ? getListingImageUrl(listing.profile_image)
    : (listing as any).hero_image_url || (listing as any).logo_url || null;

  return (
    <div className="bg-bg-2 text-text-primary py-10 pb-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo / Hero Image */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt={listing.listing_name || "Listing image"}
                className="w-full rounded-xl shadow-lg object-cover max-h-64"
              />
            ) : (
              <div className="h-40 w-40 flex items-center justify-center rounded-full bg-[#CC5A47] text-white text-3xl font-bold shadow-lg">
                {initialsFromName(listing.listing_name || "Listing")}
              </div>
            )}
          </div>

          {/* Name, Badges, Category, Location */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">
              {listing.listing_name || "Listing"}
            </h1>

            <p className="text-sm text-text-secondary mb-3">
              {category}
              {location ? ` • ${location}` : ""}
              {hasVirtualOption ? " • Online" : ""}
            </p>

            <ListingBadges listing={listing} averageRating={averageRating} />
          </div>
        </div>
      </div>
    </div>
  );
}

