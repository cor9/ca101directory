import Container from "@/components/container";
import HomeHero from "@/components/home/home-hero";
import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/airtable-item";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "",
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log("HomePage, searchParams", searchParams);

  // For now, we don't have sponsor items in Airtable
  const sponsorItems: any[] = [];
  const showSponsor = false; // Disable sponsor items for now
  const hasSponsorItem = false;

  const {
    category,
    tag,
    sort,
    page,
    q: query,
    f: filter,
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({
    category,
    tag,
    sortKey,
    reverse,
    query,
    filter,
    currentPage,
    hasSponsorItem,
  });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log("HomePage, totalCount", totalCount, ", totalPages", totalPages);

  return (
    <Container className="mt-12 mb-16 flex flex-col gap-12">
      <HomeHero />

      <div className="flex flex-col md:flex-row gap-8">
        {/* right content: item grid */}
        <div className="flex-1">
          <div className="flex flex-col gap-8">
            {/* when no items are found */}
            {items?.length === 0 && <EmptyGrid />}

            {/* when items are found */}
            {items && items.length > 0 && (
              <section className="">
                <ItemGrid
                  items={items}
                  sponsorItems={sponsorItems}
                  showSponsor={showSponsor}
                />

                <div className="mt-8 flex items-center justify-center">
                  <CustomPagination routePrefix="/" totalPages={totalPages} />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <NewsletterCard />
    </Container>
  );
}
