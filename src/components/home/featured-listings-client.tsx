"use client";

import { ListingCardView } from "@/components/directory/ListingCardClient";
import type { CardData } from "@/lib/card-data";

interface FeaturedListingsClientProps {
  listings: CardData[];
}

/** Featured Professionals: the same shared card as every other listing grid. */
export default function FeaturedListingsClient({
  listings,
}: FeaturedListingsClientProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((card) => (
        <ListingCardView key={card.id} card={card} />
      ))}
    </div>
  );
}
