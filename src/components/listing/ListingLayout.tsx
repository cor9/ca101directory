import { ListingAbout } from "@/components/listing/ListingAbout";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { ListingDifferentiators } from "@/components/listing/ListingDifferentiators";
import {
  ListingPortfolio,
  ListingVideo,
} from "@/components/listing/ListingMedia";
import { ProfileHeader } from "@/components/listing/ProfileHeader";
import { ProfileSection } from "@/components/listing/ProfileSection";
import type { Listing } from "@/data/listings";
import Link from "next/link";
import type { ReactNode } from "react";

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
  /** Contact information block (right column of the closing section). */
  sidebar?: ReactNode;
  /** After Session Details & Contact: events, reviews (inside the white card). */
  mainFooter?: ReactNode;
  /** Full-width content under the card on the charcoal frame (recommendations). */
  children?: ReactNode;
}

/**
 * Canonical profile layout: one white "miniature website" card on the
 * charcoal site frame.
 *
 *   Header (portrait, identity, socials, booking CTA)
 *   Portfolio (large grid + lightbox)
 *   About
 *   Meet Your Photographer (video)
 *   What sets this provider apart
 *   Session Details | Contact
 *   Events / Reviews
 */
export default function ListingLayout({
  listing,
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
  const isPhotographer = /photograph|headshot/i.test(category);
  const hasAbout = Boolean(listing.what_you_offer || listing.description);

  return (
    <div className="bg-bg-dark py-8 sm:py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <article className="overflow-hidden rounded-2xl bg-white text-zinc-900 shadow-xl">
          <ProfileHeader
            listing={listing}
            category={category}
            location={location}
            hasVirtualOption={hasVirtualOption}
            averageRating={averageRating}
          />

          <ListingPortfolio listing={listing} />

          {hasAbout && (
            <ProfileSection>
              <ListingAbout listing={listing} />
            </ProfileSection>
          )}

          <ListingVideo
            listing={listing}
            heading={isPhotographer ? "Meet Your Photographer" : "Meet Your Provider"}
          />

          {(listing.why_is_it_unique || listing.extras_notes) && (
            <ProfileSection>
              <ListingDifferentiators listing={listing} />
            </ProfileSection>
          )}

          <ProfileSection id="contact">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <ListingDetails
                listing={listing}
                category={category}
                location={location}
                ageRanges={ageRanges}
                services={services}
                regions={regions}
                hasVirtualOption={hasVirtualOption}
              />
              <div>{sidebar}</div>
            </div>
          </ProfileSection>

          {mainFooter}
        </article>

        {children}

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
  );
}
