import { type Listing, getListingById, getListings } from "@/lib/airtable";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { ItemInfo } from "@/types";

/**
 * Convert Airtable Listing to MkDirs Item format
 */
function listingToItem(listing: Listing): ItemInfo {
  return {
    _id: listing.id,
    _createdAt: listing.dateSubmitted,
    name: listing.businessName,
    slug: {
      _type: "slug" as const,
      current: listing.businessName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    },
    description: listing.description,
    link: listing.website || "",
    affiliateLink: null,
    sponsor: false,
    sponsorStartDate: null,
    sponsorEndDate: null,
    note: null,
    featured: listing.featured,
    icon: listing.logo
      ? {
          asset: {
            _ref: listing.logo,
            _type: "reference" as const,
          },
          hotspot: null,
          crop: null,
          alt: `${listing.businessName} logo`,
          _type: "image" as const,
          blurDataURL: null,
          imageColor: null,
        }
      : null,
    image:
      listing.gallery && listing.gallery.length > 0
        ? {
            asset: {
              _ref: listing.gallery[0],
              _type: "reference" as const,
            },
            hotspot: null,
            crop: null,
            alt: `${listing.businessName} image`,
            _type: "image" as const,
            blurDataURL: null,
            imageColor: null,
          }
        : null,
    publishDate: listing.dateApproved || listing.dateSubmitted,
    paid: listing.plan !== "Basic",
    order: null,
    pricePlan: listing.plan.toLowerCase() as any,
    freePlanStatus: listing.status.toLowerCase() as any,
    proPlanStatus: null,
    sponsorPlanStatus: null,
    rejectionReason: null,
    collections: [],
    categories:
      listing.categories?.map((categoryName) => ({
        _id: categoryName.trim().toLowerCase().replace(/\s+/g, "-"),
        _type: "category" as const,
        _createdAt: listing.dateSubmitted,
        _updatedAt: listing.dateSubmitted,
        _rev: "",
        name: categoryName,
        slug: {
          _type: "slug" as const,
          current: categoryName.toLowerCase().replace(/\s+/g, "-"),
        },
        description: null,
        group: null,
        priority: null,
      })) || [],
    tags: listing.tags?.map((tag) => ({
      _id: tag.toLowerCase().replace(/\s+/g, "-"),
      _type: "tag" as const,
      _createdAt: listing.dateSubmitted,
      _updatedAt: listing.dateSubmitted,
      _rev: "",
      name: tag,
      slug: {
        _type: "slug" as const,
        current: tag.toLowerCase().replace(/\s+/g, "-"),
      },
      description: null,
      priority: null,
    })),
    submitter: null,
    related: [],
  } as ItemInfo;
}

/**
 * Get item by id from Airtable
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
 * Get item info by id (same as getItemById for Airtable)
 */
export async function getItemInfoById(id: string): Promise<ItemInfo | null> {
  return getItemById(id);
}

/**
 * Get items from Airtable with filtering and pagination
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
      "getItems (Airtable), category:",
      category,
      "tag:",
      tag,
      "region:",
      region,
      "query:",
      query,
    );

    // Get all listings from Airtable
    const allListings = await getListings();

    // Apply filters
    let filteredListings = allListings;

    // Category filter
    if (category) {
      filteredListings = filteredListings.filter((listing) =>
        listing.categories?.some(
          (cat) => cat.toLowerCase().replace(/\s+/g, "-") === category,
        ),
      );
    }

    // Tag filter (age range)
    if (tag) {
      const tagList = tag.split(",");
      filteredListings = filteredListings.filter((listing) =>
        tagList.every((t) => listing.tags?.includes(t)),
      );
    }

    // Region filter
    if (region) {
      filteredListings = filteredListings.filter(
        (listing) => listing.region === region,
      );
    }

    // Query filter (search)
    if (query) {
      const queryLower = query.toLowerCase();
      filteredListings = filteredListings.filter(
        (listing) =>
          listing.businessName.toLowerCase().includes(queryLower) ||
          listing.description.toLowerCase().includes(queryLower) ||
          (listing.servicesOffered &&
            listing.servicesOffered.toLowerCase().includes(queryLower)),
      );
    }

    // Location filter
    if (filter) {
      // Assuming filter is location-based
      filteredListings = filteredListings.filter((listing) =>
        listing.location.toLowerCase().includes(filter.toLowerCase()),
      );
    }

    // Sort
    if (sortKey) {
      filteredListings.sort((a, b) => {
        let aVal, bVal;

        switch (sortKey) {
          case "name":
            aVal = a.businessName;
            bVal = b.businessName;
            break;
          case "publishDate":
            aVal = new Date(a.dateApproved || a.dateSubmitted);
            bVal = new Date(b.dateApproved || b.dateSubmitted);
            break;
          default:
            aVal = a.businessName;
            bVal = b.businessName;
        }

        if (reverse) {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        } else {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
      });
    } else {
      // Default sort: featured first, then by approval date
      filteredListings.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (
          new Date(b.dateApproved || b.dateSubmitted).getTime() -
          new Date(a.dateApproved || a.dateSubmitted).getTime()
        );
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
    console.error("getItems (Airtable), error:", error);
    return { items: [], totalCount: 0 };
  }
}
