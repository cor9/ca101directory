import EmptyGrid from '@/components/empty-grid';
import ItemGrid from '@/components/item-grid';
import CustomPagination from '@/components/pagination';
import { getItems } from '@/data/item';
import { DEFAULT_SORT, ITEMS_PER_PAGE, SORT_FILTER_LIST } from '@/lib/constants';
import { Suspense } from 'react';
import { constructMetadata } from '@/lib/metadata';
import { Metadata } from 'next';
import { tagQuery } from '@/sanity/lib/queries';
import { TagQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const tag = await sanityFetch<TagQueryResult>({
    query: tagQuery,
    params: { slug: params.slug }
  });
  if (!tag) {
    console.warn(`generateMetadata, tag not found for slug: ${params.slug}`);
    return;
  }

  return constructMetadata({
    title: tag.name,
    description: tag.description,
    canonicalUrl: `${siteConfig.url}/tag/${tag.slug}`,
  });
}

export default async function TagPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, page } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({ tag: params.slug, sortKey, reverse, currentPage });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log('TagPage, totalCount', totalCount, ', totalPages', totalPages);

  return (
    <div>
      {/* when no items are found */}
      {items?.length === 0 && (
        <EmptyGrid />
      )}

      {/* when items are found */}
      {
        items && items.length > 0 && (
          <section className=''>
            <ItemGrid items={items} />

            <div className="mt-8 flex items-center justify-center">
              <Suspense fallback={null}>
                <CustomPagination routePreix={`/tag/${params.slug}`} totalPages={totalPages} />
              </Suspense>
            </div>
          </section>
        )
      }
    </div>
  );
}
