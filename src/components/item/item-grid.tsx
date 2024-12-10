import ItemCard, { ItemCardSkeleton } from "@/components/item/item-card";
import { ITEMS_PER_PAGE, SUPPORT_ITEM_ICON } from "@/lib/constants";
import type { ItemListQueryResult } from "@/sanity.types";
import ItemCard2, { ItemCard2Skeleton } from "./item-card-2";

interface ItemGridProps {
  items: ItemListQueryResult;
}

/**
 * ItemGrid component
 *
 * show item card with icon when SUPPORT_ITEM_ICON is true
 * otherwise show item card with image
 */
export default function ItemGrid({ items }: ItemGridProps) {
  return (
    <div>
      {items && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) =>
            SUPPORT_ITEM_ICON ? (
              <ItemCard2 key={item._id} item={item} />
            ) : (
              <ItemCard key={item._id} item={item} />
            ),
          )}
        </div>
      )}
    </div>
  );
}

export function ItemGridSkeleton({
  count = ITEMS_PER_PAGE,
}: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, index) =>
        SUPPORT_ITEM_ICON ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: ignore
          <ItemCard2Skeleton key={index} />
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: ignore
          <ItemCardSkeleton key={index} />
        ),
      )}
    </div>
  );
}
