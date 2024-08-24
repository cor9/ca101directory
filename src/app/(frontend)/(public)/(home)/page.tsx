import ItemGrid from '@/components/item-grid';
import { defaultSort, ITEMS_PER_PAGE, sorting } from '@/lib/constants';
import { ItemListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';

const buildQuery = (category?: string, tag?: string, sortKey?: string, reverse?: boolean, query?: string, currentPage: number = 1) => {
  const orderDirection = reverse ? 'desc' : 'asc';
  const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(publishDate desc)';
  const queryPattern = query ? `*${query}*` : '';
  const queryCondition = query
    ? `&& (name[].value match "${queryPattern}" || description[].value match "${queryPattern}")`
    : '';
  const categoryCondition = category ? `&& "${category}" in categories[]->slug.current` : '';
  const tagCondition = tag ? `&& "${tag}" in tags[]->slug.current` : '';
  const offsetStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const offsetEnd = offsetStart + ITEMS_PER_PAGE;

  // @sanity-typegen-ignore
  const countQuery = `count(*[_type == "item" && defined(slug.current) 
    ${queryCondition} ${categoryCondition} ${tagCondition}])`;
  // @sanity-typegen-ignore
  const dataQuery = `*[_type == "item" && defined(slug.current) 
    ${queryCondition} ${categoryCondition} ${tagCondition}] ${sortOrder} [${offsetStart}...${offsetEnd}] {
    ...,
    categories[]->{
      ...,
    },
    tags[]->{
      ...,
    }
  }`;
  console.log('buildQuery, countQuery', countQuery);
  console.log('buildQuery, dataQuery', dataQuery);
  return { countQuery, dataQuery };
};

async function getItems({
  category,
  tag,
  sortKey,
  reverse,
  query,
  currentPage
}: {
  category?: string;
  tag?: string;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
  currentPage: number
}) {
  console.log('getItems, query', query, 'sortKey', sortKey, 'reverse', reverse);
  const { countQuery, dataQuery } = buildQuery(category, tag, sortKey, reverse, query, currentPage);
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
  console.log('HomePage, searchParams', searchParams);

  const { category, tag, sort, page, q: query } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({ category, tag, sortKey, reverse, query, currentPage });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log('HomePage, totalCount', totalCount, ", totalPages", totalPages);
  // console.log('HomePage, items', items);

  return (
    <ItemGrid items={items} totalPages={totalPages} />
  );
}
