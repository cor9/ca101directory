import Container from "@/components/container";
import HomeCategoryGrid from "@/components/home/home-category-grid";
import HomeFeaturedListings from "@/components/home/home-featured-listings";
import HomeHero from "@/components/home/home-hero";
import HomeHowItWorks from "@/components/home/home-how-it-works";
import HomeValueProps from "@/components/home/home-value-props";
import ItemGrid from "@/components/item/item-grid";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { homeConfig } from "@/config/home";
import { priceConfig } from "@/config/price";
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
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  canonicalUrl: `${siteConfig.url}/`,
});

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log("HomePage, searchParams", searchParams);

  // For now, we don't have sponsor items in Airtable
  const sponsorItems: never[] = [];
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
  const rawPage = page ? Number(page) : 1;
  const currentPage = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage);
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

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Container className="mt-12 mb-16">
        <HomeHero />
      </Container>

      {/* Value Props Section */}
      <HomeValueProps />

      {/* Category Grid Section */}
      <HomeCategoryGrid />

      {/* How It Works Section */}
      <HomeHowItWorks />

      {/* Featured Listings Section */}
      <HomeFeaturedListings />

      {/* All Listings Section */}
      <Container className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">All Professionals</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our complete directory of vetted child actor professionals
          </p>
        </div>

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
      </Container>

      {/* Call-to-Action Section */}
      <Container className="py-16">
        <div className="rounded-2xl bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 border border-brand-blue/20 px-6 py-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {homeConfig.ctaBanner.heading}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
            {homeConfig.ctaBanner.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={homeConfig.ctaBanner.primaryCta.href}
              className="rounded-lg bg-brand-orange px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-orange-dark"
            >
              {homeConfig.ctaBanner.primaryCta.label}
            </Link>
            <Link
              href={homeConfig.ctaBanner.secondaryCta.href}
              className="rounded-lg border-2 border-brand-blue px-8 py-3 font-semibold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
            >
              {homeConfig.ctaBanner.secondaryCta.label}
            </Link>
          </div>
        </div>
      </Container>

      {/* Pricing Preview Section */}
      <Container className="py-16">
        <div className="rounded-2xl bg-muted p-8">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {homeConfig.pricing.heading}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              {homeConfig.pricing.subheading}
            </p>
          </div>
          <div className="mx-auto grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {priceConfig.plans.map((plan) => {
              const isFeatured =
                plan.title.toLowerCase() ===
                homeConfig.pricing.featuredPlan.toLowerCase();
              const priceDisplay =
                plan.price === 0
                  ? "Free"
                  : currencyFormatter.format(plan.price);

              return (
                <article
                  key={plan.title}
                  className={`flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm transition-shadow ${
                    isFeatured
                      ? "border-brand-orange shadow-lg shadow-brand-orange/25"
                      : "border-border"
                  }`}
                >
                  {isFeatured ? (
                    <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      Most Popular
                    </span>
                  ) : null}
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {plan.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-6 text-3xl font-bold text-foreground">
                    {priceDisplay}
                    {plan.price !== 0 ? (
                      <span className="ml-1 text-lg font-semibold text-muted-foreground">
                        {plan.priceSuffix}
                      </span>
                    ) : null}
                  </div>
                  <ul className="mt-6 space-y-2 text-sm text-card-foreground">
                    {plan.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1 text-brand-orange">
                          ✓
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.limitations.length > 0 ? (
                    <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation}>✕ {limitation}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/pricing"
              className="font-semibold text-foreground hover:text-brand-blue transition-colors"
            >
              View Full Pricing Details →
            </Link>
          </div>
        </div>
      </Container>

      {/* Newsletter Section */}
      <Container className="py-16">
        <NewsletterCard />
      </Container>
    </div>
  );
}
