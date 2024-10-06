import ItemCard from '@/components/item/item-card';
import { ItemListQueryResult } from '@/sanity.types';
import { Skeleton } from '../ui/skeleton';

interface ItemGridProps {
  items: ItemListQueryResult;
}

export default function ItemGrid({ items }: ItemGridProps) {
  return (
    <div>
      {items && items.length > 0 && (
        <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {
            items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))
          }
        </div>
      )}
    </div>
  );
}

export function ItemGridSkeleton() {
  return (
    <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="w-full aspect-[16/9]" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}
