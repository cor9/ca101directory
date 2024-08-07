import Pagination from '@/components/pagination';
import { defaultSort, sorting } from '@/lib/constants';
import { SearchItemQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { groq } from 'next-sanity';
import Link from 'next/link';

const buildQuery = (sortKey?: string, reverse?: boolean, query?: string, currentPage: number = 1) => {
  const orderDirection = reverse ? 'desc' : 'asc';
  const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(publishDate desc)';
  const queryPattern = query ? `*${query}*` : '';
  const queryCondition = query
    ? `&& (name[].value match "${queryPattern}" || description[].value match "${queryPattern}")`
    : '';
  const itemsPerPage = 3;
  const offset = (currentPage - 1) * itemsPerPage;

  const countQuery = groq`count(*[_type == "item" && defined(slug.current) ${queryCondition}])`;
  const dataQuery = groq`*[_type == "item" && defined(slug.current) 
    ${queryCondition}] ${sortOrder} [${offset}...${offset + itemsPerPage}]{
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
  const totalCount = await sanityFetch<number>({ query: countQuery });
  const items = await sanityFetch<SearchItemQueryResult>({ query: dataQuery });
  return { items, totalCount };
}

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, page, q: query } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const currentPage = page ? Number(page) : 1;

  const { items, totalCount } = await getItems({ sortKey, reverse, query, currentPage });
  console.log('getItems, totalCount', totalCount);
  const resultsText = totalCount > 1 ? 'results' : 'result';
  const totalPages = Math.ceil(totalCount / 3);

  return (
    <>
      <h1 className="text-3xl">{items.length}</h1>
      {query ? (
        <p className="mb-4">
          {items.length === 0
            ? 'There are no items that match '
            : `Showing ${items.length} ${resultsText} for `}
          <span className="font-bold">&quot;{query}&quot;</span>
        </p>
      ) : null}
      {
        items.length > 0 && items.map((item) => (
          <div key={item._id}>
            <Link href={`/item/${item.slug?.current}`}>
              {item.name?.find(entry => entry._key === "en")?.value}
            </Link>
          </div>
        ))
      }
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
