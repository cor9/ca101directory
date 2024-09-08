import ItemGrid from '@/components/item-grid';
import { getItems } from '@/data/item';
import { defaultSort, ITEMS_PER_PAGE, sorting } from '@/lib/constants';

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
  const { items, totalCount } = await getItems({ category: params.slug, sortKey, reverse, currentPage });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log('CategoryPage, totalCount', totalCount, ', totalPages', totalPages);

  return (
    <ItemGrid items={items} totalPages={totalPages} paginationPrefix={`/category/${params.slug}`} />
  );
}
