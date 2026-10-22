import type { Listing } from "@/data/listings";
import { getListingImageUrl } from "@/lib/image-urls";
import {
  getListingCapabilities,
  normalizeListingTier,
} from "@/lib/listingCapabilities";
import { safeExternalUrl } from "@/lib/url";

/**
 * Data the Book / Contact modal needs, derived from the listing and its
 * plan entitlements (Pro: email/phone/booking; Standard+: website).
 * Only real values are returned; anything missing is undefined.
 */
export function getProfileContactProps(listing: Listing) {
  const tier = normalizeListingTier(listing.plan, listing.comped);
  const caps = getListingCapabilities(tier, {}, listing.listing_type);
  const isPro = tier === "pro" || tier === "premium";
  const img = listing.profile_image || listing.logo_url;
  return {
    listingName: listing.listing_name || "this provider",
    imageUrl: img ? getListingImageUrl(img) : undefined,
    phone: caps.canClickPhone ? listing.phone?.trim() || undefined : undefined,
    bookingUrl:
      isPro && caps.canClickWebsite
        ? safeExternalUrl(listing.custom_link_url) || undefined
        : undefined,
  };
}
