import {
  type Listing,
  getListingById,
  getPublicListings,
} from "@/data/listings";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { ItemInfo } from "@/types";

/**
 * Convert Airtable Listing to MkDirs Item format
 */
function listingToItem(listing: Listing): ItemInfo {
  return {
    _id: listing.id,
    _createdAt: new Date().toISOString(),
    name: listing.listing_name || "Untitled Listing",
    slug: {
      _type: "slug" as const,
      current: (listing.listing_name || "untitled")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    },
    description: listing.what_you_offer || "",
    link: listing.website || "",
    affiliateLink: null,
    sponsor: false,
    sponsorStartDate: null,
    sponsorEndDate: null,
    note: null,
    featured: false, // Will be determined by plan
    icon: listing.profile_image
      ? {
          asset: {
            _ref: listing.profile_image,
            _type: "reference" as const,
          },
          hotspot: null,
          crop: null,
          alt: `${listing.listing_name} logo`,
          _type: "image" as const,
          blurDataURL: null,
          imageColor: null,
        }
      : null,
    image: null, // Gallery images will be handled separately
    publishDate: new Date().toISOString(),
    paid: listing.plan !== "Free",
    order: null,
    pricePlan: (listing.plan || "Free").toLowerCase() as
      | "free"
      | "basic"
      | "pro"
      | "premium",
    freePlanStatus: (listing.status || "Pending").toLowerCase() as
      | "pending"
      | "approved"
      | "rejected",
    proPlanStatus: null,
    sponsorPlanStatus: null,
    rejectionReason: null,
    collections: [],
    categories: listing.categories
      ? listing.categories.split(",").map((categoryName) => ({
          _id: categoryName.trim().toLowerCase().replace(/\s+/g, "-"),
          _type: "category" as const,
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString(),
          _rev: "",
          name: categoryName.trim(),
          slug: {
            _type: "slug" as const,
            current: categoryName.trim().toLowerCase().replace(/\s+/g, "-"),
          },
          description: null,
          group: null,
          priority: null,
        }))
      : [],
    tags: listing.age_range
      ? listing.age_range.split(",").map((tag) => ({
          _id: tag.toLowerCase().replace(/\s+/g, "-"),
          _type: "tag" as const,
          _createdAt: new Date().toISOString(),
          _updatedAt: new Date().toISOString(),
          _rev: "",
          name: tag,
          slug: {
            _type: "slug" as const,
            current: tag.toLowerCase().replace(/\s+/g, "-"),
          },
          description: null,
          priority: null,
        }))
      : [],
    submitter: null,
    related: [],
  } as ItemInfo;
}

/**
 * Get item by id from Supabase
 */
export async function getItemById(id: string): Promise<ItemInfo | null> {
  try {
    const listing = await getListingById(id);
    if (!listing) return null;
    return listingToItem(listing);
  } catch (error) {
    console.error("getItemById, error:", error);
    return null;
  }
}

/**
 * Get item info by id (same as getItemById for Supabase)
 */
export async function getItemInfoById(id: string): Promise<ItemInfo | null> {
  return getItemById(id);
}

/**
 * Get items from Supabase with filtering and pagination
 */
export async function getItems({
  collection,
  category,
  tag,
  region,
  sortKey,
  reverse,
  query,
  filter,
  currentPage,
  hasSponsorItem,
}: {
  collection?: string;
  category?: string;
  tag?: string;
  region?: string;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
  filter?: string;
  currentPage: number;
  hasSponsorItem?: boolean;
}) {
  try {
    console.log(
      "getItems (Supabase), category:",
      category,
      "tag:",
      tag,
      "region:",
      region,
      "query:",
      query,
    );

    // Get all listings from Supabase
    const allListings = await getPublicListings({
      q: query,
      region,
      category,
    });

    // Apply additional filters
    let filteredListings = allListings;

    // Tag filter (age range)
    if (tag) {
      const tagList = tag.split(",");
      filteredListings = filteredListings.filter(
        (listing) =>
          listing.age_range &&
          tagList.every((t) => listing.age_range?.includes(t)),
      );
    }

    // Location filter
    if (filter) {
      filteredListings = filteredListings.filter(
        (listing) =>
          listing.city?.toLowerCase().includes(filter.toLowerCase()) ||
          listing.state?.toLowerCase().includes(filter.toLowerCase()),
      );
    }

    // Sort
    if (sortKey) {
      filteredListings.sort((a, b) => {
        let aVal: string | Date;
        let bVal: string | Date;

        switch (sortKey) {
          case "name":
            aVal = a.listing_name || "";
            bVal = b.listing_name || "";
            break;
          case "publishDate":
            aVal = new Date();
            bVal = new Date();
            break;
          default:
            aVal = a.listing_name || "";
            bVal = b.listing_name || "";
        }

        if (reverse) {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    } else {
      // Default sort: by name
      filteredListings.sort((a, b) => {
        const aName = a.listing_name || "";
        const bName = b.listing_name || "";
        return aName.localeCompare(bName);
      });
    }

    const totalCount = filteredListings.length;
    const itemsPerPage = hasSponsorItem ? ITEMS_PER_PAGE - 1 : ITEMS_PER_PAGE;

    // Pagination
    const offsetStart = (currentPage - 1) * itemsPerPage;
    const offsetEnd = offsetStart + itemsPerPage;
    const paginatedListings = filteredListings.slice(offsetStart, offsetEnd);

    // Convert to ItemInfo format
    const items = paginatedListings.map(listingToItem);

    return { items, totalCount };
  } catch (error) {
    console.error("getItems (Supabase), error:", error);
    return { items: [], totalCount: 0 };
  }
}
