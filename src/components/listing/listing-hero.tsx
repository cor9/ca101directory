import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ProfileImage } from "@/components/listing/listing-images";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import type { Listing } from "@/data/listings";
import { EditIcon, GlobeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { DisplayCategory } from "./types";

interface ListingHeroProps {
  listing: Listing;
  averageRating: { average: number; count: number };
  isOwner: boolean;
  showFavorite: boolean;
  showReviews: boolean;
  categories: DisplayCategory[];
}

export function ListingHero({
  listing,
  averageRating,
  isOwner,
  showFavorite,
  showReviews,
  categories,
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
        <ProfileImage
          listing={listing}
          fallbackIconUrl={categories[0]?.iconUrl || null}
        />

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
                <div className="flex items-center gap-3 rounded-xl border border-[var(--mustard-yellow)] bg-[var(--cream)]/90 px-3 py-2 shadow-sm">
                  <Image
                    src="/101approvedbadge.png"
                    alt="Child Actor 101 Approved"
                    width={56}
                    height={56}
                    className="h-12 w-12 object-contain"
                  />
                  <span className="text-xs font-semibold tracking-[0.2em] text-[var(--charcoal)]">
                    101 APPROVED
                  </span>
                </div>
              )}

              {listing.updated_at && (
                <p className="text-xs">
                  Last updated:{" "}
                  {new Date(listing.updated_at).toLocaleDateString("en-US", {
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

          {categories.length > 0 && (
            <div className="space-y-3">
              <h2 className="bauhaus-heading text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink)]">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(({ key, displayName, iconUrl }, index) => {
                  const colors = [
                    "orange",
                    "blue",
                    "mustard",
                    "green",
                  ] as const;
                  const colorClass = colors[index % colors.length];

                  return (
                    <span
                      key={key}
                      className={`badge ${colorClass} flex items-center gap-2`}
                    >
                      {iconUrl && (
                        <Image
                          src={iconUrl}
                          alt={displayName}
                          width={20}
                          height={20}
                          className="h-5 w-5 rounded-full object-contain"
                        />
                      )}
                      {displayName}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
