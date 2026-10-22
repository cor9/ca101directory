import type { Listing } from "@/data/listings";
import { isIndustryPro } from "@/lib/listings/listingType";
import Link from "next/link";
import type { ReactNode } from "react";
import { ListingAbout } from "./ListingAbout";
import { ListingCTA } from "./ListingCTA";
import { ListingDetails } from "./ListingDetails";
import { ListingDifferentiators } from "./ListingDifferentiators";
import { ListingHeader } from "./ListingHeader";
import { ListingMedia } from "./ListingMedia";
import { ListingPricing } from "./ListingPricing";

interface ListingLayoutProps {
  listing: Listing;
  slug: string;
  category: string;
  location: string;
  ageRanges: string[];
  services: string[];
  regions: string[];
  hasVirtualOption: boolean;
  averageRating?: { average: number; count: number };
  /** Right-hand sticky column (contact info, favorite button, ...). */
  sidebar?: ReactNode;
  /** Rendered in the main column after the profile sections (events, reviews). */
  mainFooter?: ReactNode;
  /** Full-width content under the two-column grid (recommendations). */
  children?: ReactNode;
}

/**
 * Canonical Listing Layout
 *
 * Single source of truth for public listing pages.
 * Applies to /directory, /category/[slug], and /listing/[slug]
 *
 * Structure:
 * 1. Header Block (Logo, Name, Badges, Category, Location)
 * 2. Primary CTA Row (Website, Contact, View Gallery)
 * 3. Two-column body (lg: 2/3 main + 1/3 sticky sidebar)
 *    main: About, Pricing, Media (Video → Gallery), Differentiators, events/reviews
 *    sidebar: Contact Information, Details
 * 7. Back to Directory
 */
export default function ListingLayout({
  listing,
  slug,
  category,
  location,
  ageRanges,
  services,
  regions,
  hasVirtualOption,
  averageRating,
  sidebar,
  mainFooter,
  children,
}: ListingLayoutProps) {
  const industryPro = isIndustryPro(listing.listing_type);
  return (
    <>
      {/* 1. Header Block */}
      <ListingHeader
        listing={listing}
        category={category}
        location={location}
        averageRating={averageRating}
        hasVirtualOption={hasVirtualOption}
      />

      {/* 2. Primary CTA Row */}
      <ListingCTA listing={listing} slug={slug} />

      {/* 3. Two-column body: main content (2/3) + sticky sidebar (1/3) */}
      <div className="bg-bg-dark py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            <div className="min-w-0 space-y-8 lg:col-span-2">
              <ListingAbout listing={listing} />

              {/* Pricing Section */}
              {!industryPro && <ListingPricing listing={listing} />}

              {/* 4. Media Section (Video → Gallery) */}
              <ListingMedia listing={listing} />

              {/* 5. Differentiators Section (What Makes Us Unique, Additional Notes) */}
              <ListingDifferentiators listing={listing} />

              {mainFooter}
            </div>

            {/* Sticky sidebar: contact info + details sit beside the gallery */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-1 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              {sidebar}
              {/* 6. Details */}
              <ListingDetails
                listing={listing}
                category={category}
                location={location}
                ageRanges={ageRanges}
                services={services}
                regions={regions}
                hasVirtualOption={hasVirtualOption}
              />
            </aside>
          </div>

          {children}

          {/* 7. Back to Directory */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <Link
              href="/directory"
              className="text-sm text-neutral-300 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              ← Back to Directory
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
