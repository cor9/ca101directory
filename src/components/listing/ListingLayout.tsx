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
import { getProfileContactProps } from "@/lib/listing-contact";
import { type ProfileCopy, profileCopyFor } from "@/lib/profile-kind";
import {
  hasPrimaryContactAction,
  normalizeListingTier,
} from "@/lib/listingCapabilities";
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
  /** False when the contact card would be empty: details then use the full width */
  showContactCard?: boolean;
  /** Category-aware wording (defaults to a bookable service) */
  copy?: ProfileCopy;
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
  showContactCard = true,
  copy = profileCopyFor(null),
  mainFooter,
  children,
}: ListingLayoutProps) {
  // Show each tag once: header specialties, then remaining services, never the category itself
  const headerSpecialties = dedupeLabels(listing.specialties, [category]).slice(
    0,
    5,
  );
  const detailServices = dedupeLabels(services, [
    category,
    ...headerSpecialties,
  ]);
  const hasCta = hasPrimaryContactAction(listing);
  const contactProps = getProfileContactProps(listing, {
    allowBooking: copy.allowBooking,
    ctaLabel: copy.ctaLabel,
  });
  // Closing CTA in the contact card is only the Book / Contact modal button
  // (Pro with an email). The website already has its own button in the header.
  const tier = normalizeListingTier(listing.plan, listing.comped);
  const showClosingCta =
    (tier === "pro" || tier === "premium") &&
    listing.listing_type !== "INDUSTRY_PRO" &&
    Boolean(listing.email?.trim());
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
            copy={copy}
          />

          <ListingPortfolio listing={listing} />

          {hasAbout && (
            <ProfileSection>
              <ListingAbout listing={listing} />
            </ProfileSection>
          )}

          <ListingVideo
            listing={listing}
            heading={
              isPhotographer ? "Meet Your Photographer" : "Meet Your Provider"
            }
          />

          {(listing.why_is_it_unique || listing.extras_notes) && (
            <ProfileSection>
              <ListingDifferentiators listing={listing} />
            </ProfileSection>
          )}

          {/* Details + contact: two cards on a tinted band, sized to their content */}
          <ProfileSection id="contact" className="bg-zinc-50">
            <div
              className={`grid grid-cols-1 items-start gap-6 ${showContactCard ? "md:grid-cols-2" : ""}`}
            >
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <ListingDetails
                  listing={listing}
                  category={category}
                  location={location}
                  ageRanges={ageRanges}
                  services={detailServices}
                  regions={regions}
                  hasVirtualOption={hasVirtualOption}
                  copy={copy}
                />
              </div>
              {showContactCard && (
              <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <div>{sidebar}</div>
                {showClosingCta && (
                  <div className="mt-8 border-t border-zinc-200 pt-6">
                    <ContactActions
                      listingId={listing.id}
                      website={listing.website}
                      email={listing.email}
                      listingType={listing.listing_type}
                      plan={listing.plan}
                      comped={listing.comped}
                      variant="profile"
                      className="flex-col items-stretch [&>a]:justify-center [&>button]:justify-center"
                      hideWebsiteLink
                      {...contactProps}
                    />
                  </div>
                )}
              </div>
              )}
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
              {...contactProps}
            />
          </StickyContactBar>
        )}

      </div>
    </div>
  );
}
