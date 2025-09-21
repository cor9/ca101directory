import Container from "@/components/container";
import HomeHero from "@/components/home/home-hero";
import ItemGrid from "@/components/item/item-grid";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/airtable-item";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";

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

      {/* Call-to-Action Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to List Your Business?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join our trusted directory of child actor professionals. Get discovered by families looking for quality services.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Submit Your Listing
          </Link>
          <Link 
            href="/pricing" 
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>

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

      {/* Pricing Preview Section */}
      <div className="bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Basic</h3>
            <div className="text-3xl font-bold mb-4">$29<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-2 text-sm">
              <li>✓ Business listing</li>
              <li>✓ Contact information</li>
              <li>✓ Basic profile</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Most Popular</div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <div className="text-3xl font-bold mb-4">$49<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-2 text-sm">
              <li>✓ Everything in Basic</li>
              <li>✓ Featured placement</li>
              <li>✓ Gallery images</li>
              <li>✓ Priority support</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Premium</h3>
            <div className="text-3xl font-bold mb-4">$99<span className="text-lg text-gray-500">/month</span></div>
            <ul className="space-y-2 text-sm">
              <li>✓ Everything in Pro</li>
              <li>✓ Top placement</li>
              <li>✓ Analytics dashboard</li>
              <li>✓ Custom branding</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link 
            href="/pricing" 
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            View Full Pricing Details →
          </Link>
        </div>
      </div>

      <NewsletterCard />
    </Container>
  );
}
