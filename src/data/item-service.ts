import { getCategories } from "@/data/categories";
import {
  type Listing,
  getListingById,
  getPublicListings,
} from "@/data/listings";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { ItemInfo } from "@/types";

/**
 * Generate a proper SEO-friendly slug from listing name
 */
function generateSlug(listingName: string, id: string): string {
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
 * Convert Airtable Listing to MkDirs Item format
 */
async function listingToItem(listing: Listing): Promise<ItemInfo> {
  return {
    _id: listing.id,
    _createdAt: new Date().toISOString(),
    name: listing.listing_name || "Untitled Listing",
    slug: {
      _type: "slug" as const,
      current:
        listing.slug ||
        generateSlug(listing.listing_name || "untitled", listing.id),
    },
    description: (listing.what_you_offer || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
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
      ? await Promise.all(
          listing.categories.map(async (categoryValue) => {
            // Check if it's a UUID (category ID) or a category name
            const isUuid =
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
                categoryValue,
              );

            let categoryName = categoryValue.trim();

            if (isUuid) {
              // Resolve UUID to category name
              try {
                const categories = await getCategories();
                const category = categories.find(
                  (cat) => cat.id === categoryValue,
                );
                if (category) {
                  categoryName = category.category_name;
                } else {
                  console.warn(
                    `Category UUID ${categoryValue} not found, using UUID as name`,
                  );
                }
              } catch (error) {
                console.error(
                  `Error resolving category UUID ${categoryValue}:`,
                  error,
                );
              }
            }

            return {
              _id: categoryName.toLowerCase().replace(/\s+/g, "-"),
              _type: "category" as const,
              _createdAt: new Date().toISOString(),
              _updatedAt: new Date().toISOString(),
              _rev: "",
              name: categoryName,
              slug: {
                _type: "slug" as const,
                current: categoryName.toLowerCase().replace(/\s+/g, "-"),
              },
              description: null,
              group: null,
              priority: null,
            };
          }),
        )
      : [],
    tags: listing.age_range
      ? listing.age_range.map((tag) => ({
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
    return await listingToItem(listing);
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
  state,
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
  state?: string;
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
      "state:",
      state,
      "query:",
      query,
    );

    // Get all listings from Supabase
    const allListings = await getPublicListings({
      q: query,
      region,
      state,
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

    // Apply custom sorting for directory page when no explicit sort is requested
    // or when it's the default sort (publishDate desc)
    const isDefaultSort = !sortKey || (sortKey === "publishDate" && reverse);

    if (isDefaultSort) {
      // Custom sorting for directory page: Featured first, then Pro (avoiding duplicates), then alphabetical
      filteredListings.sort((a, b) => {
        // 1. Featured listings first (featured = true)
        const aFeatured = a.featured || false;
        const bFeatured = b.featured || false;

        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;

        // 2. Pro listings second (plan = 'Pro' or 'Premium'), but only if not already featured
        const aIsPro = (a.plan === "Pro" || a.plan === "Premium") && !aFeatured;
        const bIsPro = (b.plan === "Pro" || b.plan === "Premium") && !bFeatured;

        if (aIsPro && !bIsPro) return -1;
        if (!aIsPro && bIsPro) return 1;

        // 3. Everything else alphabetically by name
        const aName = a.listing_name || "";
        const bName = b.listing_name || "";
        return aName.localeCompare(bName);
      });
    } else {
      // Apply requested sorting
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
    }

    const totalCount = filteredListings.length;
    const itemsPerPage = hasSponsorItem ? ITEMS_PER_PAGE - 1 : ITEMS_PER_PAGE;

    // Pagination
    const offsetStart = (currentPage - 1) * itemsPerPage;
    const offsetEnd = offsetStart + itemsPerPage;
    const paginatedListings = filteredListings.slice(offsetStart, offsetEnd);

    // Convert to ItemInfo format
    const items = await Promise.all(paginatedListings.map(listingToItem));

    return { items, totalCount };
  } catch (error) {
    console.error("getItems (Supabase), error:", error);
    return { items: [], totalCount: 0 };
  }
}
