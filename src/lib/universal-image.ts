/**
 * Universal image handling for Child Actor 101 Directory
 * Provides consistent image fallback logic across all components
 */

import { getListingImageUrl } from "@/lib/image-urls";

export interface UniversalImageResult {
  src: string;
  alt: string;
  isFallback: boolean;
}

/**
 * Get the best available image for a listing with proper fallbacks
 */
export async function getUniversalListingImage(listing: {
  listing_name?: string | null;
  profile_image?: string | null;
  categories?: string[] | null;
  is_claimed?: boolean | null;
  plan?: string | null;
}): Promise<UniversalImageResult> {
  const listingName = listing.listing_name || "Listing";

  // 1. Use profile image if available
  if (listing.profile_image) {
    return {
      src: getListingImageUrl(listing.profile_image),
      alt: `Logo of ${listingName}`,
      isFallback: false,
    };
  }

  // NO FALLBACKS - Return null if no image
  // Stock illustrations and category icons should NOT be used as listing images
  // They imply editorial endorsement and hurt credibility
  return {
    src: "",
    alt: `No image available for ${listingName}`,
    isFallback: false,
  };
}

/**
 * Get the best available image for an item with proper fallbacks
 */
export async function getUniversalItemImage(item: {
  name?: string;
  image?: any;
  icon?: any;
  categories?: Array<{ name: string }>;
}): Promise<UniversalImageResult> {
  const itemName = item.name || "Item";
  // Helper: ensure Supabase storage paths become absolute public URLs
  const normalizeImageUrl = (maybeUrl?: string | null) => {
    if (!maybeUrl) return "";
    return maybeUrl.startsWith("http")
      ? maybeUrl
      : getListingImageUrl(maybeUrl);
  };

  // 1. Use item.image if available
  if (item.image) {
    const rawImageUrl =
      typeof item.image === "string"
        ? item.image
        : item.image.src || item.image.asset?._ref;
    const imageUrl = normalizeImageUrl(rawImageUrl);
    if (imageUrl) {
      return {
        src: imageUrl,
        alt: `Image of ${itemName}`,
        isFallback: false,
      };
    }
  }

  // 2. Use item.icon if available
  if (item.icon) {
    const rawIconUrl =
      typeof item.icon === "string"
        ? item.icon
        : item.icon.src || item.icon.asset?._ref;
    const iconUrl = normalizeImageUrl(rawIconUrl);
    if (iconUrl) {
      return {
        src: iconUrl,
        alt: `Icon of ${itemName}`,
        isFallback: false,
      };
    }
  }

  // NO FALLBACKS - Return null if no image
  // Stock illustrations and category icons should NOT be used as listing images
  return {
    src: "",
    alt: `No image available for ${itemName}`,
    isFallback: false,
  };
}

/**
 * Client-side hook for universal image handling
 */
export function useUniversalImage() {
  const getListingImage = async (
    listing: Parameters<typeof getUniversalListingImage>[0],
  ) => {
    return getUniversalListingImage(listing);
  };

  const getItemImage = async (
    item: Parameters<typeof getUniversalItemImage>[0],
  ) => {
    return getUniversalItemImage(item);
  };

  return {
    getListingImage,
    getItemImage,
  };
}
