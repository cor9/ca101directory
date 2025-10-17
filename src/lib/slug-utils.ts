/**
 * Generate a proper SEO-friendly slug from listing name
 */
export function generateSlug(listingName: string, id: string): string {
  if (!listingName || listingName.trim() === "") {
    // If no name, create a generic slug with ID suffix
    return `listing-${id.slice(-8)}`;
  }
  
  return listingName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate slug from ItemInfo object
 */
export function generateSlugFromItem(item: { name: string; _id: string }): string {
  return generateSlug(item.name, item._id);
}

/**
 * Generate slug from Listing object
 */
export function generateSlugFromListing(listing: { listing_name: string | null; id: string }): string {
  return generateSlug(listing.listing_name || "", listing.id);
}
