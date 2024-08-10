import ItemCard from '@/components/item-card';
import Pagination from '@/components/pagination';
import { defaultSort, ITEMS_PER_PAGE, sorting } from '@/lib/constants';
import { ItemListOfCategoryQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';

const buildQuery = (slug: string, sortKey?: string, reverse?: boolean, currentPage: number = 1) => {
  const orderDirection = reverse ? 'desc' : 'asc';
  const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(publishDate desc)';
  const queryCondition = slug
    ? `&& "${slug}" in categories[]->slug.current`
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
  const [totalCount, items] = await Promise.all([
    sanityFetch<number>({ query: countQuery }),
    sanityFetch<ItemListOfCategoryQueryResult>({ query: dataQuery })
  ]);
  return { items, totalCount };
}

export default async function CategoryPage({
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
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log('CategoryPage, totalCount', totalCount, ', totalPages', totalPages);

  return (
    <section className=''>
      <div className="mt-8 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.length > 0 && items.map((item) => {
          return <ItemCard key={item._id} item={item} />;
        })}
      </div>

      <div className="mt-8 w-full flex items-center justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </section>
  );
}
