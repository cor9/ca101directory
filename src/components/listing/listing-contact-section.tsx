import Link from "next/link";

import { ClaimButton } from "@/components/claim/claim-button";
import type { Listing } from "@/data/listings";
import {
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

  return (
    <section className="flex flex-col gap-6">
      <div className="listing-card-blue">
        <h2 className="bauhaus-heading text-lg font-semibold text-neutral-200">
          Contact Information
        </h2>
        <ul className="mt-4 space-y-4 text-base text-neutral-200">
          {hasLocation && (
            <li className="flex items-start gap-3">
              <MapPinIcon className="mt-1 h-4 w-4 text-orange-400" />
              <span>
                {[listing.city, listing.state].filter(Boolean).join(", ")}
              </span>
            </li>
          )}

          {regions.length > 0 && (
            <li className="ml-7 text-sm opacity-80">{regions.join(", ")}</li>
          )}

          {listing.phone && (
            <li className="flex items-start gap-3">
              <PhoneIcon className="mt-1 h-4 w-4 text-orange-400" />
              <a
                href={`tel:${listing.phone}`}
                className="hover:text-orange-300 transition-colors"
              >
                {listing.phone}
              </a>
            </li>
          )}

          {listing.email && (
            <li className="flex items-start gap-3">
              <MailIcon className="mt-1 h-4 w-4 text-orange-400" />
              <a
                href={`mailto:${listing.email}`}
                className="hover:text-orange-300 transition-colors"
              >
                {listing.email}
              </a>
            </li>
          )}

          {hasVirtualOption && (
            <li className="flex items-start gap-3">
              <GlobeIcon className="mt-1 h-4 w-4 text-orange-400" />
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

      {/* 17C: Profile Page Micro-transactions - Add-ons for vendors */}
      {listing.is_claimed && listing.owner_id && (
        <div className="bg-card-surface border border-border-subtle rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Enhance Your Visibility
          </h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-3 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                checked={listing.featured || false}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">⭐</span>
                  <span className="text-sm font-medium text-text-primary">
                    Featured in Category
                  </span>
                  <span className="text-xs text-text-muted">(monthly)</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Priority placement in category pages
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-3 transition-colors cursor-pointer group">
              <input type="checkbox" className="mt-1" disabled readOnly />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔍</span>
                  <span className="text-sm font-medium text-text-primary">
                    Search Boost
                  </span>
                  <span className="text-xs text-text-muted">(monthly)</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Appear in top 2 search results
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-3 transition-colors cursor-pointer group">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                checked={listing.badge_approved || false}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">🏅</span>
                  <span className="text-sm font-medium text-text-primary">
                    Verified Badge
                  </span>
                  <span className="text-xs text-text-muted">(one-time)</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Build trust with families
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-3 transition-colors cursor-pointer group">
              <input type="checkbox" className="mt-1" disabled readOnly />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <span className="text-sm font-medium text-text-primary">
                    Multi-City Listing
                  </span>
                  <span className="text-xs text-text-muted">(monthly)</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  List in multiple locations
                </p>
              </div>
            </label>
          </div>
          {/* 18G: The One Sentence */}
          <p className="mt-3 text-xs text-text-muted italic">
            Providers with these features receive 3–5× more parent contact.
          </p>
          <Link
            href="/pricing?from=profile-addons"
            className="mt-2 inline-block text-sm text-accent-teal hover:text-accent-teal/80 transition-colors"
          >
            Manage add-ons →
          </Link>
        </div>
      )}

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

      <div>
        <Link
          href="/"
          className="text-sm text-neutral-300 hover:text-white underline-offset-4 hover:underline transition-colors"
        >
          ← Back to Directory
        </Link>
      </div>
    </section>
  );
}
