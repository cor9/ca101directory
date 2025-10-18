/**
 * Universal image handling for Child Actor 101 Directory
 * Provides consistent image fallback logic across all components
 */

import { getCategoryIconsMap } from "@/data/categories";
import { getCategoryIconUrl, getListingImageUrl } from "@/lib/image-urls";

export interface UniversalImageResult {
  src: string;
  alt: string;
  isFallback: boolean;
}

/**
 * Get the best available image for a listing with proper fallbacks
 */
export async function getUniversalListingImage(
  listing: {
    listing_name?: string | null;
    profile_image?: string | null;
    categories?: string[] | null;
    is_claimed?: boolean | null;
    plan?: string | null;
  }
): Promise<UniversalImageResult> {
  const listingName = listing.listing_name || "Listing";
  
  // 1. Use profile image if available
  if (listing.profile_image) {
    return {
      src: getListingImageUrl(listing.profile_image),
      alt: `Logo of ${listingName}`,
      isFallback: false,
    };
  }

  // 2. For free/unclaimed listings, use category icon fallback
  const needsCategoryFallback = 
    !listing.profile_image && 
    (!listing.is_claimed || listing.plan === "Free");

  if (needsCategoryFallback && listing.categories?.length) {
    try {
      const iconMap = await getCategoryIconsMap();
      const normalize = (v: string) => v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      
      // Try to find matching category icon
      for (const category of listing.categories) {
        if (!category) continue;
        
        // Try direct lookup
        let iconFilename = iconMap[category];
        
        // Try normalized lookup
        if (!iconFilename) {
          const match = Object.entries(iconMap).find(
            ([name]) => normalize(name) === normalize(category)
          );
          iconFilename = match?.[1];
        }
        
        if (iconFilename) {
          return {
            src: getCategoryIconUrl(iconFilename),
            alt: `${category} icon for ${listingName}`,
            isFallback: true,
          };
        }
      }
    } catch (error) {
      console.error("Error fetching category icons:", error);
    }
  }

  // 3. Ultimate fallback - generic clapperboard icon
  return {
    src: getCategoryIconUrl("clapperboard.png"),
    alt: `Generic icon for ${listingName}`,
    isFallback: true,
  };
}

/**
 * Get the best available image for an item with proper fallbacks
 */
export async function getUniversalItemImage(
  item: {
    name?: string;
    image?: any;
    icon?: any;
    categories?: Array<{ name: string }>;
  }
): Promise<UniversalImageResult> {
  const itemName = item.name || "Item";
  
  // 1. Use item.image if available
  if (item.image) {
    const imageUrl = typeof item.image === "string" ? item.image : item.image.src || item.image.asset?._ref;
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
    const iconUrl = typeof item.icon === "string" ? item.icon : item.icon.src || item.icon.asset?._ref;
    if (iconUrl) {
      return {
        src: iconUrl,
        alt: `Icon of ${itemName}`,
        isFallback: false,
      };
    }
  }

  // 3. Use category icon fallback
  if (item.categories?.length) {
    try {
      const iconMap = await getCategoryIconsMap();
      const normalize = (v: string) => v.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      
      for (const category of item.categories) {
        if (!category?.name) continue;
        
        // Try direct lookup
        let iconFilename = iconMap[category.name];
        
        // Try normalized lookup
        if (!iconFilename) {
          const match = Object.entries(iconMap).find(
            ([name]) => normalize(name) === normalize(category.name)
          );
          iconFilename = match?.[1];
        }
        
        if (iconFilename) {
          return {
            src: getCategoryIconUrl(iconFilename),
            alt: `${category.name} icon for ${itemName}`,
            isFallback: true,
          };
        }
      }
    } catch (error) {
      console.error("Error fetching category icons:", error);
    }
  }

  // 4. Ultimate fallback
  return {
    src: getCategoryIconUrl("clapperboard.png"),
    alt: `Generic icon for ${itemName}`,
    isFallback: true,
  };
}

/**
 * Client-side hook for universal image handling
 */
export function useUniversalImage() {
  const getListingImage = async (listing: Parameters<typeof getUniversalListingImage>[0]) => {
    return getUniversalListingImage(listing);
  };

  const getItemImage = async (item: Parameters<typeof getUniversalItemImage>[0]) => {
    return getUniversalItemImage(item);
  };

  return {
    getListingImage,
    getItemImage,
  };
}
