import { safeExternalUrl } from "@/lib/url";
import Link from "next/link";

import { ClaimButton } from "@/components/claim/claim-button";
import type { Listing } from "@/data/listings";
import {
  getListingCapabilities,
  normalizeListingTier,
  obfuscateEmail,
} from "@/lib/listingCapabilities";
import {
  ExternalLinkIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
} from "lucide-react";

/** True when the contact card would show anything at all. */
export function hasContactContent(
  listing: Listing,
  opts: { showClaimCallout: boolean; showUpgradePrompt: boolean },
): boolean {
  const caps = getListingCapabilities(
    normalizeListingTier(listing.plan, listing.comped),
    {},
    listing.listing_type,
  );
  const virtual =
    typeof listing.format === "string" &&
    listing.format.toLowerCase().includes("online");
  return Boolean(
    opts.showClaimCallout ||
      opts.showUpgradePrompt ||
      listing.city ||
      listing.state ||
      (Array.isArray(listing.region) && listing.region.length > 0) ||
      listing.phone ||
      listing.email ||
      (listing.website && !caps.canClickWebsite) ||
      virtual,
  );
}

interface ListingContactSectionProps {
  listing: Listing;
  showClaimCallout: boolean;
  showUpgradePrompt: boolean;
}

export function ListingContactSection({
  listing,
  showClaimCallout,
  showUpgradePrompt,
}: ListingContactSectionProps) {
  const hasLocation = Boolean(listing.city || listing.state || listing.region);
  const regions = Array.isArray(listing.region) ? listing.region : [];
  const hasVirtualOption =
    typeof listing.format === "string" &&
    listing.format.toLowerCase().includes("online");

  // Get tier-based capabilities for contact display
  // Gating is based on LISTING tier (what vendor pays), not viewer
  const listingTier = normalizeListingTier(listing.plan, listing.comped);
  const capabilities = getListingCapabilities(
    listingTier,
    {},
    listing.listing_type,
  );

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="mb-4 text-xl font-bold text-zinc-900">
          Contact Information
        </h2>
        <ul className="space-y-4 text-base text-zinc-800">
          {hasLocation && (
            <li className="flex items-start gap-3">
              <MapPinIcon className="mt-1 h-4 w-4 text-[#B8431F]" />
              <span>
                {[listing.city, listing.state].filter(Boolean).join(", ")}
              </span>
            </li>
          )}

          {regions.length > 0 && (
            <li className="ml-7 text-sm text-zinc-600">{regions.join(", ")}</li>
          )}

          {listing.phone && (
            <li className="flex items-start gap-3">
              <PhoneIcon className="mt-1 h-4 w-4 text-[#B8431F]" />
              {capabilities.canClickPhone ? (
                <a
                  href={`tel:${listing.phone}`}
                  className="text-zinc-900 underline-offset-2 hover:text-[#B8431F] hover:underline transition-colors"
                >
                  {listing.phone}
                </a>
              ) : (
                <span className="select-text text-zinc-800">{listing.phone}</span>
              )}
            </li>
          )}

          {listing.email && (
            <li className="flex items-start gap-3">
              <MailIcon className="mt-1 h-4 w-4 text-[#B8431F]" />
              {capabilities.canClickEmail ? (
                <a
                  href={`mailto:${listing.email}`}
                  className="text-zinc-900 underline-offset-2 hover:text-[#B8431F] hover:underline transition-colors"
                >
                  {listing.email}
                </a>
              ) : (
                <span className="select-text text-zinc-800">
                  {capabilities.obfuscateEmail
                    ? obfuscateEmail(listing.email)
                    : listing.email}
                </span>
              )}
            </li>
          )}

          {/* Website is a prominent button in the profile header when clickable; only repeat it here for listings where it is plain text */}
          {listing.website && !capabilities.canClickWebsite && (
            <li className="flex items-start gap-3">
              <ExternalLinkIcon className="mt-1 h-4 w-4 text-[#B8431F]" />
              {capabilities.canClickWebsite ? (
                <a
                  href={safeExternalUrl(listing.website) || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-900 underline-offset-2 hover:text-[#B8431F] hover:underline transition-colors"
                >
                  {listing.website
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </a>
              ) : (
                <span className="select-text text-zinc-800">
                  {listing.website
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </span>
              )}
            </li>
          )}

          {hasVirtualOption && (
            <li className="flex items-start gap-3">
              <GlobeIcon className="mt-1 h-4 w-4 text-[#B8431F]" />
              <span>Virtual services available</span>
            </li>
          )}
        </ul>
      </div>

      {showClaimCallout && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <div className="flex items-start gap-4">
            <ShieldIcon className="mt-0.5 h-7 w-7 shrink-0 text-[#C2441F]" />
            <div className="flex-1 text-zinc-900">
              <h2 className="text-lg font-bold">Own This Business?</h2>
              <p className="mt-1 text-sm text-zinc-700">
                Claim your listing to manage details, add photos and video, and
                connect with families.
              </p>
              <div className="mt-4">
                <ClaimButton
                  listingId={listing.id}
                  listingName={listing.listing_name || "Listing"}
                  claimed={listing.is_claimed === true}
                  ownerId={listing.owner_id}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REMOVED: "Enhance Your Visibility" upsell section
          - Never show upsells on public listing pages
          - Pro listings should feel confident, not transactional
          - Upsells belong in vendor dashboard only
          - This breaks trust illusion and competes with actual content
      */}

      {showUpgradePrompt && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <div className="space-y-3 text-zinc-900">
            <h3 className="text-lg font-bold">Ready to add more details?</h3>
            <p className="text-sm text-zinc-700">
              Upgrade to Pro to add a portfolio gallery, video and social links
              to your profile.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/pricing"
                className="inline-flex items-center rounded-md bg-[#C2441F] px-4 py-2 text-sm font-semibold !text-white transition-colors hover:bg-[#A93A19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                View Pricing
              </Link>
              <Link
                href="/plan-selection"
                className="inline-flex items-center rounded-md border border-zinc-900 px-4 py-2 text-sm font-semibold !text-zinc-900 transition-colors hover:bg-zinc-900 hover:!text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                Upgrade Listing
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
