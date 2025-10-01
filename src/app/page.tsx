import Container from "@/components/container";
import { ListingFilters } from "@/components/filters/ListingFilters";
import HomeCategoryGrid from "@/components/home/home-category-grid";
import HomeFeaturedListings from "@/components/home/home-featured-listings";
import HomeHero from "@/components/home/home-hero";
import HomeHowItWorks from "@/components/home/home-how-it-works";
import HomeValueProps from "@/components/home/home-value-props";
import { ListingCard } from "@/components/listings/ListingCard";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import EmptyGrid from "@/components/shared/empty-grid";
import { homeConfig } from "@/config/home";
import { priceConfig } from "@/config/price";
import { siteConfig } from "@/config/site";
import { getPublicListings } from "@/data/listings";
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
  const {
    category,
    region,
    state,
    approved101,
    q: query,
  } = searchParams as { [key: string]: string };

  console.log("HomePage, searchParams", searchParams);

  // Get listings from Supabase with filters
  let listings = await getPublicListings({
    q: query,
    category,
    region,
    state,
  });

  // Apply 101 Approved filter
  if (approved101 === "true") {
    listings = listings.filter(
      (listing) => listing.approved_101_badge === true,
    );
  }

  // Sort by plan tier (Premium > Pro > Basic > Free) then by name
  listings.sort((a, b) => {
    const planPriority = (plan: string | null) => {
      switch (plan) {
        case "Premium":
          return 4;
        case "Pro":
          return 3;
        case "Basic":
          return 2;
        case "Free":
          return 1;
        default:
          return 0;
      }
    };

    const aPriority = planPriority(a.plan);
    const bPriority = planPriority(b.plan);

    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }

    // If same priority, sort by name
    return (a.listing_name || "").localeCompare(b.listing_name || "");
  });

  const totalCount = listings.length;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Container className="mt-8 mb-20">
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
      <Container id="search-results" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {query ? `Search Results for "${query}"` : "All Professionals"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {query
              ? `Found ${totalCount} professional${totalCount !== 1 ? "s" : ""} matching your search`
              : "Browse our complete directory of vetted child actor professionals"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ListingFilters />
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            {listings.length === 0 ? (
              <EmptyGrid />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Call-to-Action Section */}
      <Container className="py-16">
        <div className="rounded-2xl bg-gradient-to-r from-brand-orange/5 via-brand-yellow/5 to-brand-blue/5 border border-brand-blue/20 px-6 py-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            {homeConfig.ctaBanner.heading}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
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
