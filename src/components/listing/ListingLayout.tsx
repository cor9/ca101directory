import type { Listing } from "@/data/listings";
import { ListingAbout } from "./ListingAbout";
import { ListingCTA } from "./ListingCTA";
import { ListingDetails } from "./ListingDetails";
import { ListingDifferentiators } from "./ListingDifferentiators";
import { ListingHeader } from "./ListingHeader";
import { ListingMedia } from "./ListingMedia";
import Link from "next/link";

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
 * 3. About / Description
 * 4. Media Section (Video → Gallery)
 * 5. Differentiators Section (What Makes Us Unique, Additional Notes)
 * 6. Details Grid
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
}: ListingLayoutProps) {
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

      {/* 3. About / Description */}
      <div className="bg-bg-dark py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 lg:gap-12 items-start">
            {/* Left column: Main content */}
            <div className="space-y-12">
              <ListingAbout listing={listing} />

              {/* 4. Media Section (Video → Gallery) */}
              <ListingMedia listing={listing} />

              {/* 5. Differentiators Section (What Makes Us Unique, Additional Notes) */}
              <ListingDifferentiators listing={listing} />

              {/* 6. Details Grid */}
              <ListingDetails
                listing={listing}
                category={category}
                location={location}
                ageRanges={ageRanges}
                services={services}
                regions={regions}
                hasVirtualOption={hasVirtualOption}
              />
            </div>

            {/* Right column: Sticky sidebar (ContactInfo) */}
            {/* This is handled by the page component */}
          </div>

          {/* 7. Back to Directory */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <Link
              href="/directory"
              className="text-sm text-neutral-300 hover:text-white underline-offset-4 hover:underline transition-colors"
            >
              ← Back to Directory
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

