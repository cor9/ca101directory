import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getItems } from "@/data/item-service";
import { getPublicListings } from "@/data/listings";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Location data
const LOCATIONS = {
  "los-angeles": {
    name: "Los Angeles",
    state: "California",
    shortName: "LA",
    description: "The entertainment capital of the world",
    intro:
      "Los Angeles is the heart of the entertainment industry, home to Hollywood, major studios, and countless opportunities for child actors. From acting classes in Studio City to headshot photographers in Burbank, LA offers the most comprehensive resources for young performers.",
    whyChoose: [
      "Largest concentration of industry professionals",
      "Access to major studios and production companies",
      "Year-round audition opportunities",
      "Top-tier acting schools and coaches",
      "Extensive network of agents and managers",
      "Industry events and showcases",
    ],
    neighborhoods: [
      "Hollywood",
      "Studio City",
      "Burbank",
      "Sherman Oaks",
      "West Hollywood",
      "Santa Monica",
    ],
  },
  "new-york": {
    name: "New York",
    state: "New York",
    shortName: "NYC",
    description: "The theater and commercial capital",
    intro:
      "New York City is a powerhouse for theater, commercials, and television production. With Broadway, major ad agencies, and growing film production, NYC offers unique opportunities for child actors, especially in theater and commercial work.",
    whyChoose: [
      "Broadway and Off-Broadway theater opportunities",
      "Major commercial and advertising market",
      "Growing film and TV production",
      "World-class acting training and schools",
      "Strong theater tradition and community",
      "Diverse casting opportunities",
    ],
    neighborhoods: [
      "Manhattan",
      "Brooklyn",
      "Queens",
      "Times Square",
      "Chelsea",
      "Upper West Side",
    ],
  },
  atlanta: {
    name: "Atlanta",
    state: "Georgia",
    shortName: "ATL",
    description: "The Hollywood of the South",
    intro:
      "Atlanta has become a major production hub, earning the nickname 'Hollywood of the South.' With major studios like Pinewood and Tyler Perry Studios, Atlanta offers growing opportunities for child actors at a lower cost of living than LA or NYC.",
    whyChoose: [
      "Rapidly growing film and TV production",
      "Major studio presence (Pinewood, Tyler Perry)",
      "Lower cost of living than LA/NYC",
      "Growing network of industry professionals",
      "Tax incentives attracting productions",
      "Emerging market with less competition",
    ],
    neighborhoods: [
      "Midtown",
      "Buckhead",
      "Decatur",
      "Sandy Springs",
      "Roswell",
      "Marietta",
    ],
  },
};

/**
 * Generate static params for location pages
 */
export async function generateStaticParams() {
  return Object.keys(LOCATIONS).map((city) => ({
    city,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata | undefined> {
  const location = LOCATIONS[params.city as keyof typeof LOCATIONS];

  if (!location) {
    return constructMetadata({
      title: "Location Not Found",
      description: "The requested location could not be found",
      canonicalUrl: `${siteConfig.url}/location/${params.city}`,
    });
  }

  // Get listing count for this location
  const listings = await getPublicListings();
  const locationListings = listings.filter(
    (listing) =>
      (listing.city?.toLowerCase().includes(location.name.toLowerCase()) ||
        listing.state?.toLowerCase().includes(location.state.toLowerCase()) ||
        listing.region?.some((r) =>
          r.toLowerCase().includes(location.name.toLowerCase()),
        )) &&
      listing.status === "Live" &&
      listing.is_active,
  );
  const count = locationListings.length;

  return constructMetadata({
    title: `Child Actor Resources in ${location.name} - ${count}+ Professionals`,
    description: `Find ${count}+ trusted acting coaches, headshot photographers, and talent agents for child actors in ${location.name}, ${location.state}. ${location.description}.`,
    canonicalUrl: `${siteConfig.url}/location/${params.city}`,
  });
}

export default async function LocationPage({
  params,
  searchParams,
}: {
  params: { city: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const location = LOCATIONS[params.city as keyof typeof LOCATIONS];

  if (!location) {
    return notFound();
  }

  // Get all listings for this location
  const allListings = await getPublicListings();
  const locationListings = allListings.filter(
    (listing) =>
      (listing.city?.toLowerCase().includes(location.name.toLowerCase()) ||
        listing.state?.toLowerCase().includes(location.state.toLowerCase()) ||
        listing.region?.some((r) =>
          r.toLowerCase().includes(location.name.toLowerCase()),
        )) &&
      listing.status === "Live" &&
      listing.is_active,
  );

  // Get categories
  const categories = await getCategories();

  // Count listings by category
  const categoryCount: Record<string, number> = {};
  for (const listing of locationListings) {
    for (const category of listing.categories || []) {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
  }

  // Sort categories by count
  const topCategories = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const { sort, page } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = page ? Number(page) : 1;

  // Get items using the standard getItems function
  // Filter by checking if city/state/region matches
  const { items, totalCount } = await getItems({
    sortKey,
    reverse,
    currentPage,
    hasSponsorItem: false,
  });

  // Filter items for this location
  const locationItems = items.filter((item) => {
    // Match against the original listing data
    const matchesLocation =
      item.name?.toLowerCase().includes(location.name.toLowerCase()) ||
      item.description?.toLowerCase().includes(location.name.toLowerCase()) ||
      item.description?.toLowerCase().includes(location.state.toLowerCase());
    return matchesLocation;
  });

  const totalPages = Math.ceil(locationListings.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section - Bauhaus theme */}
      <div className="bg-card-surface rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-paper mb-2">
          Child Actor Resources in {location.name}
        </h1>
        <p className="text-xl text-paper/80">
          {location.description} • {locationListings.length} Professionals
        </p>
      </div>

      {/* Intro Content */}
      <div className="bg-bg-2 rounded-lg p-8 border-2 border-border-subtle mb-8">
        <p className="text-lg leading-relaxed text-paper mb-6">
          {location.intro}
        </p>

        <h2 className="text-2xl font-bold mb-4 text-paper">
          Why Choose {location.name} for Your Child's Acting Career?
        </h2>
        <ul className="space-y-3">
          {location.whyChoose.map((reason, index) => (
            <li key={index} className="flex items-start gap-3 text-paper/90">
              <span className="text-primary-orange text-xl mt-1">✓</span>
              <span className="flex-1">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Top Categories */}
      <div className="bg-card-surface rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-paper">
          Popular Categories in {location.shortName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topCategories.map(([categoryName, count]) => {
            const slug = categoryName
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");

            return (
              <Link
                key={categoryName}
                href={`/category/${slug}`}
                className="block bg-bg-2 rounded-lg p-4 border-2 border-border-subtle hover:border-primary-orange transition-colors"
              >
                <h3 className="font-semibold text-paper mb-1">
                  {categoryName}
                </h3>
                <p className="text-sm text-paper/70">
                  {count} professional{count !== 1 ? "s" : ""} in{" "}
                  {location.shortName}
                </p>
                <span className="text-xs text-primary-orange mt-2 inline-block">
                  View All →
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Neighborhoods */}
      <div className="bg-bg-2 rounded-lg p-8 border-2 border-border-subtle mb-8">
        <h2 className="text-2xl font-bold mb-4 text-paper">
          Areas We Serve in {location.name}
        </h2>
        <div className="flex flex-wrap gap-2">
          {location.neighborhoods.map((neighborhood) => (
            <span
              key={neighborhood}
              className="px-4 py-2 bg-card-surface text-text-primary rounded-md text-sm font-medium"
            >
              {neighborhood}
            </span>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-paper mb-6">
          All Professionals in {location.name}
        </h2>

        {locationItems.length === 0 ? (
          <EmptyGrid />
        ) : (
          <>
            <ItemGrid
              items={locationItems}
              sponsorItems={[]}
              showSponsor={false}
            />

            {totalPages > 1 && (
              <CustomPagination
                totalPages={totalPages}
                routePrefix={`/location/${params.city}`}
              />
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-surface rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-paper mb-4">
          Don't See Your Business Listed?
        </h2>
        <p className="text-paper/80 mb-6">
          Join {locationListings.length}+ professionals serving child actors in{" "}
          {location.name}
        </p>
        <Link
          href="/submit"
          className="inline-block px-8 py-4 bg-primary-orange text-white rounded-md hover:bg-primary-orange/90 transition-colors font-semibold text-lg"
        >
          List Your Business
        </Link>
      </div>
    </div>
  );
}
