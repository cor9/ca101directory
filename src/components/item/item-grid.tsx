import ItemCard from '@/components/item/item-card';
import { ItemListQueryResult } from '@/sanity.types';

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