import Grid from '@/components/grid';
import { defaultSort, sorting } from '@/lib/constants';
import { ItemListOfCategoryQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { groq } from 'next-sanity';

const buildQuery = (sortKey?: string, reverse?: boolean) => {
  const orderDirection = reverse ? 'desc' : 'asc';
  const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(publishDate desc)';
  console.log('buildQuery, sortKey', sortKey, 'reverse', reverse, 'sortOrder', sortOrder);
  return groq`*[_type == "item" && defined(slug.current) && defined(publishDate) 
    && $slug in categories[]->slug.current] ${sortOrder} {
    ...
  }`;
};

async function getCategoryItems({
  slug,
  sortKey,
  reverse
}: {
  slug?: string;
  sortKey?: string;
  reverse?: boolean
}) {
  console.log('getCategoryItems, slug', slug, 'sortKey', sortKey, 'reverse', reverse);
  const query = buildQuery(sortKey, reverse);
  console.log('getCategoryItems, query', query);
  const params = { slug };
  const results = await sanityFetch<ItemListOfCategoryQueryResult>({
    query,
    params
  });
  return results;
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const items = await getCategoryItems({ slug: params.slug, sortKey, reverse });

  return (
    <section>
      <h1 className="text-3xl">{items.length}</h1>
      {
        items.map((item) => (
          <div key={item._id}>
            <h1>{item.slug?.current}</h1>
          </div>
        ))
      }
      {/* {items.length === 0 ? (
        <p className="py-3 text-lg">{`No items found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems items={items} />
        </Grid>
      )} */}
    </section>
  );
}
