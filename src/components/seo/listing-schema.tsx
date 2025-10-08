import type { Listing } from "@/data/listings";
import { getListingImageUrl } from "@/lib/image-urls";
import { siteConfig } from "@/config/site";

interface ListingSchemaProps {
  listing: Listing;
  averageRating?: { average: number; count: number };
}

/**
 * Generate Schema.org LocalBusiness structured data for a listing
 * Helps search engines understand the business information
 */
export function ListingSchema({ listing, averageRating }: ListingSchemaProps) {
  const slug = (listing.listing_name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/listing/${slug}`,
    name: listing.listing_name,
    description: listing.what_you_offer
      ? listing.what_you_offer.replace(/<[^>]*>/g, "").slice(0, 200)
      : `Professional ${listing.categories?.[0] || "acting services"} for child actors`,
    url: listing.website || `${siteConfig.url}/listing/${slug}`,
    image: listing.profile_image
      ? getListingImageUrl(listing.profile_image)
      : undefined,
    telephone: listing.phone || undefined,
    email: listing.email || undefined,
    address: listing.city || listing.state
      ? {
          "@type": "PostalAddress",
          addressLocality: listing.city || undefined,
          addressRegion: listing.state || undefined,
          postalCode: listing.zip?.toString() || undefined,
          addressCountry: "US",
        }
      : undefined,
    areaServed: listing.region
      ? {
          "@type": "City",
          name: listing.region,
        }
      : undefined,
    priceRange: listing.plan === "Premium"
      ? "$$$"
      : listing.plan === "Pro"
        ? "$$"
        : "$",
    ...(averageRating && averageRating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.average.toFixed(1),
            reviewCount: averageRating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(listing.is_approved_101
      ? {
          award: "101 Approved Professional",
        }
      : {}),
  };

  // Remove undefined values
  const cleanSchema = JSON.parse(
    JSON.stringify(schema, (key, value) => (value === undefined ? null : value))
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}

/**
 * Generate Schema.org BreadcrumbList for navigation
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Generate Schema.org Organization for the main site
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Child Actor 101",
    alternateName: "Child Actor 101 Directory",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "hello@childactor101.com",
      availableLanguage: "English",
    },
    sameAs: [
      // Add your social media profiles here
      "https://www.facebook.com/childactor101",
      "https://www.instagram.com/childactor101",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
