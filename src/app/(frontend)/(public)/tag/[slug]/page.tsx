import Pagination from '@/components/pagination';
import { defaultSort, ITEMS_PER_PAGE, sorting } from '@/lib/constants';
import { ItemListOfCategoryQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { groq } from 'next-sanity';
import Link from 'next/link';

const buildQuery = (slug: string, sortKey?: string, reverse?: boolean, currentPage: number = 1) => {
  const orderDirection = reverse ? 'desc' : 'asc';
  const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(publishDate desc)';
  const queryCondition = slug
    ? `&& "${slug}" in tags[]->slug.current`
    : '';
  const offsetStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const offsetEnd = offsetStart + ITEMS_PER_PAGE;

  // @sanity-typegen-ignore
  const countQuery = `count(*[_type == "item" && defined(slug.current) && defined(publishDate) 
    ${queryCondition}])`;
  // @sanity-typegen-ignore
  const dataQuery = `*[_type == "item" && defined(slug.current) && defined(publishDate) 
    ${queryCondition}] ${sortOrder} [${offsetStart}...${offsetEnd}] {
    ...
  }`;
  console.log('buildQuery, countQuery', countQuery);
  console.log('buildQuery, dataQuery', dataQuery);
  return { countQuery, dataQuery };
};

async function getItems({
  slug,
  sortKey,
  reverse,
  currentPage
}: {
  slug: string;
  sortKey?: string;
  reverse?: boolean;
  currentPage: number
}) {
  console.log('getItems, slug', slug, 'sortKey', sortKey, 'reverse', reverse);
  const { countQuery, dataQuery } = buildQuery(slug, sortKey, reverse, currentPage);
  const totalCount = await sanityFetch<number>({ query: countQuery });
  const items = await sanityFetch<ItemListOfCategoryQueryResult>({ query: dataQuery });
  return { items, totalCount };
}

export default async function TagPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, page } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({ slug: params.slug, sortKey, reverse, currentPage });
  console.log('TagPage, totalCount', totalCount);
  const totalPages = Math.ceil(totalCount / 3);

  return (
    <section>
      <h1 className="text-3xl">{totalCount}</h1>
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
    </section>
  );
}
