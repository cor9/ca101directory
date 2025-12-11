"use client";

import type { ItemInfo } from "@/types";
import ListingCardClient from "@/components/directory/ListingCardClient";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ListingCarouselProps {
  listings: ItemInfo[];
}

export function ListingCarousel({ listings }: ListingCarouselProps) {
  if (!listings.length) return null;

  return (
    <div className="relative">
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {listings.map((item) => (
            <div key={item._id} className="w-[300px] shrink-0">
              <ListingCardClient item={item} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
