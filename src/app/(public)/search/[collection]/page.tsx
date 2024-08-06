import { defaultSort, sorting } from '@/lib/constants';
import { ItemListOfCategoryQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { groq } from 'next-sanity';

export const itemListOfCategoryQuery = (sortKey?: string, reverse?: boolean) => {
  const orderDirection = reverse ? 'desc' : 'asc';
  const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(_createdAt asc)';
  console.log('itemListOfCategoryQuery, sortKey', sortKey, 'reverse', reverse, 'sortOrder', sortOrder);
  return groq`*[_type == "item" && defined(slug.current) && $slug in categories[]->slug.current] ${sortOrder} {
    ...
  }`;
};

async function getCollectionProducts({
  collection,
  sortKey,
  reverse
}: {
  collection?: string;
  sortKey?: string;
  reverse?: boolean
}) {
  console.log('getCollectionProducts, collection', collection, 'sortKey', sortKey, 'reverse', reverse);
  const query = itemListOfCategoryQuery(sortKey, reverse);
  console.log('getCollectionProducts, query', query);
  const params = { slug: collection };
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
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({ collection: params.collection, sortKey, reverse });

  return (
    <section>
      <h1 className="text-3xl">{products.length}</h1>
      {
        products.map((product) => (
          <div key={product._id}>
            <h1>{product.slug?.current}</h1>
          </div>
        ))
      }
      {/* {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )} */}
    </section>
  );
}
