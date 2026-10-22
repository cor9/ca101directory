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

          {listing.website && (
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
        <div
          className="listing-card"
          style={{ background: "var(--mustard-yellow)" }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <ShieldIcon className="h-8 w-8 text-[var(--faded-red-orange)]" />
            </div>
            <div className="flex-1 text-[var(--navy)]">
              <h2 className="text-lg font-semibold">Own This Business?</h2>
              <p className="mt-2 text-sm opacity-80">
                Claim your listing to manage details, unlock upgrades, and stay
                in touch with new families.
              </p>
              <div className="mt-3">
                <ClaimButton
                  listingId={listing.id}
                  listingName={listing.listing_name || "Listing"}
                  claimed={listing.is_claimed === true}
                  ownerId={listing.owner_id}
                  className="btn-primary"
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
        <div className="listing-card" style={{ background: "var(--cream)" }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden>
              📈
            </span>
            <div className="space-y-3 text-[var(--navy)]">
              <h3 className="font-semibold text-[var(--faded-red-orange)]">
                Ready to add more details?
              </h3>
              <p className="text-sm opacity-80">
                Upgrade to share your audience fit, unique approach, and service
                formats directly on your profile.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-md bg-[var(--faded-red-orange)] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--mustard-yellow)] hover:text-[var(--navy)]"
                >
                  View Pricing Plans
                </Link>
                <Link
                  href="/plan-selection"
                  className="inline-flex items-center rounded-md border border-[var(--faded-red-orange)] px-3 py-2 text-sm font-semibold text-[var(--faded-red-orange)] transition-colors hover:bg-[var(--faded-red-orange)] hover:text-white"
                >
                  Upgrade Listing
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
