import type { ItemInfo } from "@/types";
import ListingCardClient from "./ListingCardClient";

interface CategoryClientProps {
  initialItems: ItemInfo[];
  initialTotalCount: number;
  initialTotalPages: number;
  categoryName?: string;
}

/**
 * Results grid. Paging is server-driven (?page=N links in ResultsPagination),
 * so every active filter stays in the URL instead of living in client state.
 */
export default function CategoryClient({ initialItems }: CategoryClientProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {initialItems.map((item) => (
        <ListingCardClient key={item._id} item={item} />
      ))}
    </div>
  );
}
