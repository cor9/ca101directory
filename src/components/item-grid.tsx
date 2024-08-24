import { Suspense } from 'react';
import ItemCard from '@/components/item-card';
import CustomPagination from '@/components/pagination';
import { ItemListQueryResult } from '@/sanity.types';

interface ItemGridProps {
  items: ItemListQueryResult;
  totalPages: number;
}

export default function ItemGrid({ items, totalPages }: ItemGridProps) {
  return (
    <>
      {
        items && items.length > 0 ? (
          <section className=''>
            <div className="my-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items.length > 0 && items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>

            <div className="my-8 w-full flex items-center justify-center">
              <Suspense fallback={null}>
                <CustomPagination totalPages={totalPages} />
              </Suspense>
            </div>
          </section>
        ) : (
          // border rounded-lg bg-accent/25 
          <div className="my-8 h-24 w-full flex items-center justify-center">
            <p>No Results Found</p>
          </div>
        )
      }
    </>
  );
}