import { Suspense } from 'react';
import ItemCard from '@/components/item-card';
import CustomPagination from '@/components/pagination';
import { ItemListQueryResult } from '@/sanity.types';

interface ItemGridProps {
  items: ItemListQueryResult;
  totalPages: number;
  paginationPrefix: string;
}

export default function ItemGrid({ items, totalPages, paginationPrefix }: ItemGridProps) {
  return (
    <>
      {/* when no items are found */}
      {items?.length === 0 && (
        <div className="my-8 h-32 w-full flex items-center justify-center">
          <p className='font-medium text-muted-foreground'>
            No results found.
          </p>
        </div>
      )}

      {/* when items are found */}
      { items && items.length > 0 && (
          <section className=''>
            <div className="mt-12 gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            <div className="mt-12 flex items-center justify-center">
              <Suspense fallback={null}>
                <CustomPagination routePreix={paginationPrefix} totalPages={totalPages} />
              </Suspense>
            </div>
          </section>
        )
      }
    </>
  );
}