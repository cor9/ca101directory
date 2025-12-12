import { createServerClient } from "@/lib/supabase";
import { getPublicListings, sortListingsByPriority } from "./listings";
import type { Listing } from "./listings";

/**
 * Calculate vendor's relative position in their category
 * Returns number of similar providers appearing above them
 */
export async function getVendorPosition(
  listingId: string,
  categoryName?: string,
): Promise<{
  position: number;
  totalSimilar: number;
  aboveCount: number;
  categoryName: string | null;
}> {
  const supabase = createServerClient();

  // Get the vendor's listing
  const { data: vendorListing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (error || !vendorListing) {
    return {
      position: 0,
      totalSimilar: 0,
      aboveCount: 0,
      categoryName: null,
    };
  }

  // Get category name from listing or parameter
  const primaryCategory =
    categoryName ||
    (Array.isArray(vendorListing.categories) &&
    vendorListing.categories.length > 0
      ? vendorListing.categories[0]
      : null);

  if (!primaryCategory) {
    return {
      position: 0,
      totalSimilar: 0,
      aboveCount: 0,
      categoryName: null,
    };
  }

  // Get all listings in same category
  const allListings = await getPublicListings({
    category: primaryCategory,
    state: vendorListing.state || undefined,
  });

  // Sort by priority (same logic as category pages)
  const sortedListings = sortListingsByPriority(allListings);

  // Find vendor's position
  const vendorIndex = sortedListings.findIndex((l) => l.id === listingId);

  if (vendorIndex === -1) {
    return {
      position: sortedListings.length + 1,
      totalSimilar: sortedListings.length,
      aboveCount: sortedListings.length,
      categoryName: primaryCategory,
    };
  }

  // Count how many appear above (higher priority)
  const aboveCount = vendorIndex;

  return {
    position: vendorIndex + 1,
    totalSimilar: sortedListings.length,
    aboveCount,
    categoryName: primaryCategory,
  };
}
