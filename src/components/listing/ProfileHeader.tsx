import { ContactActions } from "@/components/listing/contact-actions";
import type { Listing } from "@/data/listings";
import { getListingImageUrl } from "@/lib/image-urls";
import {
  getListingCapabilities,
  normalizeListingTier,
} from "@/lib/listingCapabilities";
import { safeExternalUrl } from "@/lib/url";
import { Facebook, Globe, Instagram, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  listing: Listing;
  category: string;
  location: string;
  hasVirtualOption: boolean;
  averageRating?: { average: number; count: number };
}

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join("") || "CA"
  );
}

export function ProfileHeader({
  listing,
  category,
  location,
  hasVirtualOption,
  averageRating,
}: ProfileHeaderProps) {
  const tier = normalizeListingTier(listing.plan, listing.comped);
  const caps = getListingCapabilities(tier, {}, listing.listing_type);
  const isPro = tier === "pro" || tier === "premium";
  const isIndustryPro = listing.listing_type === "INDUSTRY_PRO";

  const portrait = listing.profile_image
    ? getListingImageUrl(listing.profile_image)
    : listing.logo_url
      ? getListingImageUrl(listing.logo_url)
      : null;

  const trust = listing.trust_level;
  const verified =
    trust === "verified" ||
    trust === "background_checked" ||
    trust === "verified_safe";
  const approved101 =
    listing.badge_approved === true || listing.is_approved_101 === true;

  // Socials/website are only clickable on Standard+ (see listingCapabilities)
  const socials = caps.canClickSocials
    ? [
        { label: "Website", href: safeExternalUrl(listing.website), Icon: Globe },
        { label: "Instagram", href: safeExternalUrl(listing.instagram_url), Icon: Instagram },
        { label: "Facebook", href: safeExternalUrl(listing.facebook_url), Icon: Facebook },
        { label: "YouTube", href: safeExternalUrl(listing.youtube_url), Icon: Youtube },
        { label: "LinkedIn", href: safeExternalUrl(listing.linkedin_url), Icon: Linkedin },
      ].filter((s) => s.href)
    : [];
  const tiktok = caps.canClickSocials ? safeExternalUrl(listing.tiktok_url) : null;
  const bookingUrl =
    caps.canClickWebsite && isPro ? safeExternalUrl(listing.custom_link_url) : null;

  const specialties = (listing.specialties || []).filter(Boolean).slice(0, 5);

  return (
    <header className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-start">
      {/* Portrait + badges */}
      <div className="flex shrink-0 flex-col items-center gap-2 md:items-start">
        <div className="relative h-28 w-28 overflow-hidden rounded-full bg-zinc-100 shadow-md ring-4 ring-white">
          {portrait ? (
            <Image
              src={portrait}
              alt={listing.listing_name || "Profile photo"}
              fill
              sizes="112px"
              priority
              className="object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-3xl font-bold text-white">
              {initials(listing.listing_name || "")}
            </div>
          )}
        </div>
      </div>

      {/* Identity */}
      <div className="min-w-0 flex-1 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#B8431F]">
          {category}
        </p>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
          {listing.listing_name || "Listing"}
        </h1>
        {(location || hasVirtualOption) && (
          <p className="mt-2 text-lg font-semibold text-zinc-800">
            {location}
            {location && hasVirtualOption ? " · " : ""}
            {hasVirtualOption ? "Online sessions available" : ""}
          </p>
        )}
        {averageRating && averageRating.count > 0 && (
          <a
            href="#reviews"
            className="mt-1 inline-block text-sm font-medium text-zinc-700 hover:underline"
          >
            <span className="text-amber-500">★</span>{" "}
            {averageRating.average.toFixed(1)} ({averageRating.count} review
            {averageRating.count === 1 ? "" : "s"})
          </a>
        )}
        <div className="mt-3 flex flex-wrap justify-center gap-1.5 md:justify-start">
          {listing.featured && !isIndustryPro && (
            <span className="rounded-full bg-[#E4A72E] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-zinc-900">
              Featured
            </span>
          )}
          {isPro && !isIndustryPro && (
            <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Pro
            </span>
          )}
          {approved101 && (
            <span className="rounded-full bg-[#CC5A47] px-2.5 py-1 text-xs font-bold text-white">
              101 Approved
            </span>
          )}
          {verified && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
              Verified
            </span>
          )}
        </div>
        {specialties.length > 0 && (
          <ul className="mt-3 flex flex-wrap justify-center gap-1.5 md:justify-start">
            {specialties.map((s) => (
              <li
                key={s}
                className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        {(socials.length > 0 || tiktok) && (
          <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors hover:bg-zinc-900 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
            {tiktok && (
              <li>
                <a
                  href={tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-10 items-center justify-center rounded-full bg-zinc-100 px-3 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-900 hover:text-white"
                >
                  TikTok
                </a>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Primary booking / contact CTA */}
      <div className="flex shrink-0 flex-col items-center gap-2 md:items-end">
        <ContactActions
          listingId={listing.id}
          website={listing.website}
          email={listing.email}
          listingType={listing.listing_type}
          plan={listing.plan}
          comped={listing.comped}
          variant="profile"
          className="flex-col items-stretch md:items-end"
        />
        {bookingUrl && (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#B8431F] underline-offset-4 hover:underline"
          >
            {listing.custom_link_name || "Book a session"} →
          </a>
        )}
      </div>
    </header>
  );
}
