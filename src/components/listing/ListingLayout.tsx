import { ListingAbout } from "@/components/listing/ListingAbout";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { ListingDifferentiators } from "@/components/listing/ListingDifferentiators";
import {
  ListingPortfolio,
  ListingVideo,
} from "@/components/listing/ListingMedia";
import { ContactActions } from "@/components/listing/contact-actions";
import { StickyContactBar } from "@/components/listing/StickyContactBar";
import { ProfileHeader } from "@/components/listing/ProfileHeader";
import { ProfileSection } from "@/components/listing/ProfileSection";
import type { Listing } from "@/data/listings";
import { dedupeLabels } from "@/lib/labels";
import { hasPrimaryContactAction } from "@/lib/listingCapabilities";
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
  // Show each tag once: header specialties, then remaining services, never the category itself
  const headerSpecialties = dedupeLabels(listing.specialties, [category]).slice(0, 5);
  const detailServices = dedupeLabels(services, [category, ...headerSpecialties]);
  const hasCta = hasPrimaryContactAction(listing);
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
            specialties={headerSpecialties}
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

          {/* Session details + contact: two balanced cards on a tinted band */}
          <ProfileSection id="contact" className="bg-zinc-50">
            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <ListingDetails
                  listing={listing}
                  category={category}
                  location={location}
                  ageRanges={ageRanges}
                  services={detailServices}
                  regions={regions}
                  hasVirtualOption={hasVirtualOption}
                />
              </div>
              <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex-1">{sidebar}</div>
                {hasCta && (
                  <div className="mt-8 border-t border-zinc-200 pt-6">
                    <ContactActions
                      listingId={listing.id}
                      website={listing.website}
                      email={listing.email}
                      listingType={listing.listing_type}
                      plan={listing.plan}
                      comped={listing.comped}
                      variant="profile"
                      className="flex-col items-stretch [&>a]:justify-center"
                    />
                  </div>
                )}
              </div>
            </div>
          </ProfileSection>

          {mainFooter}
        </article>

        {children}

        {hasCta && (
          <StickyContactBar name={listing.listing_name || "Listing"}>
            <ContactActions
              listingId={listing.id}
              website={listing.website}
              email={listing.email}
              listingType={listing.listing_type}
              plan={listing.plan}
              comped={listing.comped}
              variant="profile"
            />
          </StickyContactBar>
        )}

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
