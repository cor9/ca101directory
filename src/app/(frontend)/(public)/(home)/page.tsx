import ItemGrid from '@/components/item-grid';
import { defaultSort, ITEMS_PER_PAGE, sorting } from '@/lib/constants';
import { getItems } from '@/data/item';

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
