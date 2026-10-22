import { ListingCardView } from "@/components/directory/ListingCardClient";
import type { Listing } from "@/data/listings";
import { listingToCardData } from "@/lib/card-data";

interface ListingCardProps {
  listing: Listing;
  className?: string;
}

/** Raw listing -> the shared listing card (search results). */
export function ListingCard({ listing, className }: ListingCardProps) {
  return (
    <ListingCardView card={listingToCardData(listing)} className={className} />
  );
}
