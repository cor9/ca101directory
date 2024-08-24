import ItemGrid from '@/components/item-grid';
import { defaultSort, ITEMS_PER_PAGE, sorting } from '@/lib/constants';
import { getItems } from '@/data/item';

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, page, q: query } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({ sortKey, reverse, query, currentPage });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log('SearchPage, totalCount', totalCount, ", totalPages", totalPages);

  return (
    <ItemGrid items={items} totalPages={totalPages} />
  );
}
