import ItemCard from '@/components/item-card';
import CustomPagination from '@/components/pagination';
import { defaultSort, ITEMS_PER_PAGE, sorting } from '@/lib/constants';
import { ItemListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { Suspense } from 'react';

const buildQuery = (sortKey?: string, reverse?: boolean, query?: string, currentPage: number = 1) => {
  const orderDirection = reverse ? 'desc' : 'asc';
  const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(publishDate desc)';
  const queryPattern = query ? `*${query}*` : '';
  const queryCondition = query
    ? `&& (name[].value match "${queryPattern}" || description[].value match "${queryPattern}")`
    : '';
  const offsetStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const offsetEnd = offsetStart + ITEMS_PER_PAGE;

  // @sanity-typegen-ignore
  const countQuery = `count(*[_type == "item" && defined(slug.current) ${queryCondition}])`;
  // @sanity-typegen-ignore
  const dataQuery = `*[_type == "item" && defined(slug.current) 
    ${queryCondition}] ${sortOrder} [${offsetStart}...${offsetEnd}] {
    ...
  }`;
  console.log('buildQuery, countQuery', countQuery);
  console.log('buildQuery, dataQuery', dataQuery);
  return { countQuery, dataQuery };
};

async function getItems({
  sortKey,
  reverse,
  query,
  currentPage
}: {
  sortKey?: string;
  reverse?: boolean;
  query?: string;
  currentPage: number
}) {
  console.log('getItems, query', query, 'sortKey', sortKey, 'reverse', reverse);
  const { countQuery, dataQuery } = buildQuery(sortKey, reverse, query, currentPage);
  const [totalCount, items] = await Promise.all([
    sanityFetch<number>({ query: countQuery }),
    sanityFetch<ItemListQueryResult>({ query: dataQuery })
  ]);
  return { items, totalCount };
}

export default async function HomePage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, page, q: query } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({ sortKey, reverse, query, currentPage });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log('HomePage, totalCount', totalCount, ", totalPages", totalPages);

  return (
    <section className=''>
      <div className="mt-8 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.length > 0 && items.map((item) => {
          return <ItemCard key={item._id} item={item} />;
        })}
      </div>

      <div className="mt-8 w-full flex items-center justify-center">
        <Suspense fallback={null}>
          <CustomPagination totalPages={totalPages} />
        </Suspense>
      </div>
    </section>
  );
}
