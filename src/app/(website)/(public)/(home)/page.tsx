import ItemGrid from '@/components/item-grid';
import { DEFAULT_SORT, ITEMS_PER_PAGE, SORT_FILTER_LIST } from '@/lib/constants';
import { getItems } from '@/data/item';
import EmptyGrid from '@/components/empty-grid';
import CustomPagination from '@/components/pagination';
import { Suspense } from 'react';

export default async function HomePage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // console.log('HomePage, searchParams', searchParams);
  const { category, tag, sort, page, q: query } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({ category, tag, sortKey, reverse, query, currentPage });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log('HomePage, totalCount', totalCount, ", totalPages", totalPages);
  // console.log('HomePage, items', items);

  return (
    <>
      {/* when no items are found */}
      {items?.length === 0 && (
        <EmptyGrid />
      )}

      {/* when items are found */}
      {items && items.length > 0 && (
        <section className=''>
          <ItemGrid items={items} />

          <div className="mt-8 flex items-center justify-center">
            <Suspense fallback={null}>
              <CustomPagination routePreix='/' totalPages={totalPages} />
            </Suspense>
          </div>
        </>
      )}
    </>
  );
}
