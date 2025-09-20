import { ITEMS_PER_PAGE } from "@/lib/constants";
import { getListings, getListingById, type Listing } from "@/lib/airtable";
import type { ItemInfo } from "@/types";

/**
 * Convert Airtable Listing to MkDirs Item format
 */
function listingToItem(listing: Listing): ItemInfo {
  return {
    _id: listing.id,
    _type: "item",
    name: listing.businessName,
    description: listing.description,
    introduction: listing.servicesOffered || listing.description,
    slug: {
      current: listing.businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    },
    publishDate: listing.dateApproved || listing.dateSubmitted,
    featured: listing.featured,
    sponsor: false, // We'll handle sponsors separately
    forceHidden: listing.status !== 'Approved',
    logo: listing.logo ? {
      asset: {
        _ref: listing.logo,
        _type: "reference"
      }
    } : undefined,
    gallery: listing.gallery?.map(url => ({
      asset: {
        _ref: url,
        _type: "reference"
      }
    })) || [],
    category: listing.category.map(cat => ({
      _ref: cat.toLowerCase().replace(/\s+/g, '-'),
      _type: "reference"
    })),
    tags: listing.ageRange.map(age => ({
      _ref: age.toLowerCase().replace(/\s+/g, '-'),
      _type: "reference"
    })),
    // Custom fields for Child Actor 101
    location: listing.location,
    virtual: listing.virtual,
    ageRange: listing.ageRange,
    plan: listing.plan,
    approved101: listing.approved101,
    website: listing.website,
    instagram: listing.instagram,
    email: listing.email,
    phone: listing.phone,
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
  sortKey?: string;
  reverse?: boolean;
  query?: string;
  filter?: string;
  currentPage: number;
  hasSponsorItem?: boolean;
}) {
  try {
    console.log("getItems (Airtable), category:", category, "tag:", tag, "query:", query);

    // Get all listings from Airtable
    const allListings = await getListings();
    
    // Apply filters
    let filteredListings = allListings;

    // Category filter
    if (category) {
      filteredListings = filteredListings.filter(listing => 
        listing.category.some(cat => 
          cat.toLowerCase().replace(/\s+/g, '-') === category
        )
      );
    }

    // Tag filter (age range)
    if (tag) {
      const tagList = tag.split(",");
      filteredListings = filteredListings.filter(listing =>
        tagList.every(t => listing.ageRange.includes(t))
      );
    }

    // Query filter (search)
    if (query) {
      const queryLower = query.toLowerCase();
      filteredListings = filteredListings.filter(listing =>
        listing.businessName.toLowerCase().includes(queryLower) ||
        listing.description.toLowerCase().includes(queryLower) ||
        (listing.servicesOffered && listing.servicesOffered.toLowerCase().includes(queryLower))
      );
    }

    // Location filter
    if (filter) {
      // Assuming filter is location-based
      filteredListings = filteredListings.filter(listing =>
        listing.location.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Sort
    if (sortKey) {
      filteredListings.sort((a, b) => {
        let aVal, bVal;
        
        switch (sortKey) {
          case 'name':
            aVal = a.businessName;
            bVal = b.businessName;
            break;
          case 'publishDate':
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
        return new Date(b.dateApproved || b.dateSubmitted).getTime() - 
               new Date(a.dateApproved || a.dateSubmitted).getTime();
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
