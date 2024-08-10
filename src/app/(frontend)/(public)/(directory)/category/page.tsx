import Pagination from '@/components/pagination';
import ItemCard from '@/components/item-card';
import { defaultSort, ITEMS_PER_PAGE, sorting } from '@/lib/constants';
import { SearchItemQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import Link from 'next/link';

const buildQuery = (sortKey?: string, reverse?: boolean, currentPage: number = 1) => {
  const orderDirection = reverse ? 'desc' : 'asc';
  const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(publishDate desc)';
  const offsetStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const offsetEnd = offsetStart + ITEMS_PER_PAGE;

  // @sanity-typegen-ignore
  const countQuery = `count(*[_type == "item" && defined(slug.current)])`;
  // @sanity-typegen-ignore
  const dataQuery = `*[_type == "item" && defined(slug.current)] 
    ${sortOrder} [${offsetStart}...${offsetEnd}] {
    ...
  }`;
  console.log('buildQuery, countQuery', countQuery);
  console.log('buildQuery, dataQuery', dataQuery);
  return { countQuery, dataQuery };
};

async function getItems({
  sortKey,
  reverse,
  currentPage
}: {
  sortKey?: string;
  reverse?: boolean;
  currentPage: number
}) {
  console.log('getItems, sortKey', sortKey, 'reverse', reverse);
  const { countQuery, dataQuery } = buildQuery(sortKey, reverse, currentPage);
  const totalCount = await sanityFetch<number>({ query: countQuery });
  const items = await sanityFetch<SearchItemQueryResult>({ query: dataQuery });
  return { items, totalCount };
}

export default async function CategoryListPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, page } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const currentPage = page ? Number(page) : 1;

  const { items, totalCount } = await getItems({ sortKey, reverse, currentPage });
  console.log('CategoryListPage, totalCount', totalCount);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <section>
      {/* <h1 className="text-3xl">{totalCount}</h1> */}

      {/* {
        items.length > 0 && items.map((item) => (
          <div key={item._id}>
            <Link href={`/item/${item.slug?.current}`}>
              {item.name?.find(entry => entry._key === "en")?.value}
            </Link>
          </div>
        ))
      } */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {items.length > 0 && items.map((item) => {
          return <ItemCard key={item._id} item={item} />;
        })}
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </section>
  );
}
