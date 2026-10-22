"use client";

import { ListingCardView } from "@/components/directory/ListingCardClient";
import type { Listing } from "@/data/listings";
import { listingToCardData } from "@/lib/card-data";

interface ListingCardClientProps {
  listing: Listing;
  className?: string;
  /** Kept for existing callers; Featured styling now comes from the listing's own `featured` flag. */
  isFeatured?: boolean;
}

/** Raw listing -> the shared listing card (homepage Featured Professionals etc.). */
export function ListingCardClient({
  listing,
  className,
}: ListingCardClientProps) {
  return (
    <ListingCardView card={listingToCardData(listing)} className={className} />
  );
}
