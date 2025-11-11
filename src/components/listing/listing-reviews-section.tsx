import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewsDisplay } from "@/components/reviews/ReviewsDisplay";
import type { Listing } from "@/data/listings";

interface ListingReviewsSectionProps {
  listing: Listing;
  isReviewsEnabled: boolean;
}

export function ListingReviewsSection({
  listing,
  isReviewsEnabled,
}: ListingReviewsSectionProps) {
  if (!isReviewsEnabled) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="listing-card-grey">
        <ReviewsDisplay listingId={listing.id} />
      </div>
      <div
        className="listing-card-transparent border"
        style={{ borderColor: "rgba(147, 163, 181, 0.35)" }}
      >
        <ReviewForm
          listingId={listing.id}
          listingName={listing.listing_name || "Listing"}
          listingOwnerId={listing.owner_id}
        />
      </div>
    </section>
  );
}
