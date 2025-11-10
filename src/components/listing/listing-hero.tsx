import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ProfileImage } from "@/components/listing/listing-images";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import type { Listing } from "@/data/listings";
import { GlobeIcon, EditIcon, StarIcon } from "lucide-react";
import Link from "next/link";

interface ListingHeroProps {
  listing: Listing;
  averageRating: { average: number; count: number };
  isOwner: boolean;
  showFavorite: boolean;
  showReviews: boolean;
}

export function ListingHero({
  listing,
  averageRating,
  isOwner,
  showFavorite,
  showReviews,
}: ListingHeroProps) {
  return (
    <section className="listing-card-transparent">
      <div className="mb-6 flex items-center gap-2 text-sm text-[var(--ink)]">
        <Link href="/" className="hover:text-[var(--faded-red-orange)]">
          Directory
        </Link>
        <span>/</span>
        <span>{listing.listing_name}</span>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <ProfileImage listing={listing} />

        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h1 className="bauhaus-heading text-3xl font-bold text-[var(--ink)] md:text-4xl">
              {listing.listing_name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--ink)]">
              {showReviews && averageRating.count > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating
                    value={Math.round(averageRating.average)}
                    readonly
                    size="md"
                  />
                  <span>
                    {averageRating.average.toFixed(1)} ({averageRating.count}{" "}
                    review
                    {averageRating.count !== 1 ? "s" : ""})
                  </span>
                </div>
              )}

              {listing.badge_approved === true && (
                <div className="flex items-center gap-2 rounded-lg border border-[var(--mustard-yellow)] bg-[var(--cream)] px-3 py-1.5">
                  <StarIcon className="h-4 w-4 text-[var(--faded-red-orange)]" />
                  <span className="text-xs font-semibold tracking-[0.2em] text-[var(--ink)]">
                    101 APPROVED
                  </span>
                </div>
              )}

              {listing.updated_at && (
                <p className="text-xs">
                  Last updated: {new Date(listing.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {listing.website && (
              <Button size="default" asChild className="btn-primary">
                <Link
                  href={listing.website}
                  target="_blank"
                  prefetch={false}
                  className="flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <GlobeIcon className="h-4 w-4" />
                  <span>Visit Website</span>
                </Link>
              </Button>
            )}

            {isOwner && (
              <Button size="default" asChild className="btn-secondary">
                <Link
                  href="/dashboard/vendor"
                  className="flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <EditIcon className="h-4 w-4" />
                  <span>Edit Listing</span>
                </Link>
              </Button>
            )}

            {showFavorite && (
              <FavoriteButton
                listingId={listing.id}
                listingName={listing.listing_name}
                listingOwnerId={listing.owner_id}
                size="default"
                variant="outline"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
