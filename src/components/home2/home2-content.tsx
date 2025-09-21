import type { ItemListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  itemListOfFeaturedQuery,
  itemListOfLatestQuery,
} from "@/sanity/lib/queries";
import { ArrowRightIcon, SparklesIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import ItemGrid2 from "../item/item-grid-2";
import { Button } from "../ui/button";

export async function HomeContent() {
  const [featuredItems, latestItems] = await Promise.all([
    sanityFetch<ItemListQueryResult>({
      query: itemListOfFeaturedQuery,
      params: { count: 6 },
    }),
    sanityFetch<ItemListQueryResult>({
      query: itemListOfLatestQuery,
      params: { count: 6 },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* latest products */}
      {latestItems && latestItems.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-indigo-500" />
              <h2 className="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
                Latest Products
              </h2>
            </div>
          </div>

          <ItemGrid2 items={latestItems} />

          <Button asChild variant="default" size="lg" className="mx-auto">
            <Link
              href="/search"
              className="text-lg font-semibold px-16 group flex items-center gap-2"
            >
              <span className="tracking-wider">More Latest Products</span>
              <ArrowRightIcon className="size-4 icon-scale" />
            </Link>
          </Button>
        </div>
      )}

      {/* featured products */}
      {featuredItems && featuredItems.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-indigo-500" />
              <h2 className="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
                Featured Products
              </h2>
            </div>
          </div>

          <ItemGrid2 items={featuredItems} />

          <Button asChild variant="default" size="lg" className="mx-auto">
            <Link
              href="/search?f=featured%3D%3Dtrue"
              className="text-lg font-semibold px-16 group flex items-center gap-2"
            >
              <span className="tracking-wider">More Featured Products</span>
              <ArrowRightIcon className="size-4 icon-scale" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
