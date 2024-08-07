import Grid from '@/components/grid';
import { defaultSort, sorting } from '@/lib/constants';
import { SearchItemQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { groq } from 'next-sanity';

const buildQuery = (sortKey?: string, reverse?: boolean, query?: string) => {
  const orderDirection = reverse ? 'desc' : 'asc';
  const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(publishDate desc)';
  const queryPattern = query ? `*${query}*` : '';
  const queryCondition = query 
    ? `&& (name[].value match "${queryPattern}" || description[].value match "${queryPattern}")`
    : '';

  return groq`*[_type == "item" && defined(slug.current) ${queryCondition}] ${sortOrder} {
    ...
  }`;
};

async function getItems({
  sortKey,
  reverse,
  query
}: {
  sortKey?: string;
  reverse?: boolean;
  query?: string
}) {
  console.log('getItems, query', query, 'sortKey', sortKey, 'reverse', reverse);
  const queryStr = buildQuery(sortKey, reverse, query);
  console.log('getItems, queryStr', queryStr);
  const results = await sanityFetch<SearchItemQueryResult>({
    query: queryStr
  });

  return results;
}

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: query } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const items = await getItems({ sortKey, reverse, query });
  const resultsText = items.length > 1 ? 'results' : 'result';

  return (
    <>
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
            <h1>{item.slug?.current}</h1>
          </div>
        ))
      }
      {/* {items.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems items={items} />
        </Grid>
      ) : null} */}
    </>
  );
}
