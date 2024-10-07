import Container from '@/components/container';
import { NewsletterForm } from '@/components/emails/newsletter-form';
import HomeHero from '@/components/home/home-hero';
import ItemGrid from '@/components/item/item-grid';
import EmptyGrid from '@/components/shared/empty-grid';
import CustomPagination from '@/components/shared/pagination';
import { siteConfig } from '@/config/site';
import { getItems } from '@/data/item';
import { DEFAULT_SORT, ITEMS_PER_PAGE, SORT_FILTER_LIST } from '@/lib/constants';
import { constructMetadata } from '@/lib/metadata';

export const metadata = constructMetadata({
  title: "Home",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function HomePage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // console.log('HomePage, searchParams', searchParams);
  const { category, tag, sort, page, q: query } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({ category, tag, sortKey, reverse, query, currentPage });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log('HomePage, totalCount', totalCount, ", totalPages", totalPages);
  // console.log('HomePage, items', items);

  return (
    <div>
      <HomeHero />

      {/* main content shows the list of items*/}
      <Container className="mt-8">
        
      </Container>

      <Container className="my-16">
        <NewsletterForm />
      </Container>
    </div>
  );
}
