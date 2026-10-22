import { getCategories, getCategoryIconsMap } from "@/data/categories";
import {
  type Listing,
  getListingById,
  getPublicListings,
} from "@/data/listings";
import {
  normKey,
  primariesForListing,
  specialtiesForListing,
  specialtyCounts,
  unmappedValues,
} from "@/lib/category-taxonomy";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { parseGalleryItems } from "@/lib/gallery";
import { getListingImageUrl } from "@/lib/image-urls";
import {
  buildCategoryMatcher,
  listingHasPhoto,
  listingMatchesCategory,
  listingMatchesLocation,
  resolveLocationFilter,
} from "@/lib/directory-search";
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
const isUuidValue = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v.trim());

export async function listingToItem(
  listing: Listing,
  preloadedCategories?: Array<{ id: string; category_name: string }>,
): Promise<ItemInfo> {
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
    website: listing.website || null,
    email: listing.email || null,
    phone: listing.phone || null,
    listingType: listing.listing_type || null,
    affiliateLink: null,
    sponsor: false,
    sponsorStartDate: null,
    sponsorEndDate: null,
    note: null,
    featured: Boolean(listing.featured), // Map actual featured field from listing
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
    // Primary categories from the taxonomy first (consolidated names), then any
    // stored value the taxonomy does not map (retired/unmapped legacy names),
    // so nothing a listing is filed under is hidden from its own card.
    categories: Array.from(
      new Set([
        ...primariesForListing(listing).map((p) => p.name),
        ...unmappedValues(listing)
          .map((v) => {
            if (!isUuidValue(v)) return v.trim();
            return (
              preloadedCategories?.find(
                (c) => c.id.toLowerCase() === v.toLowerCase(),
              )?.category_name ?? ""
            );
          })
          .filter(Boolean),
      ]),
    ).map((categoryName) => ({
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
    })),
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
    city: listing.city || null,
    state: listing.state || null,
    logoUrl: (listing as any).logo_url || null,
    profileImageUrl: listing.profile_image
      ? getListingImageUrl(listing.profile_image)
      : null,
    galleryUrls: parseGalleryItems(listing.gallery)
      .slice(0, 4)
      .map((g) => g.url),
    // saved specialties (preserved) + those directly implied by legacy categories
    specialties: specialtiesForListing(listing).slice(0, 8),
    serviceModality: listing.service_modality || "unknown",
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
 * Get items from Supabase with strict filtering and pagination.
 *
 * Every active filter is ANDed: a listing is returned only if it matches the
 * category AND the location (state/city/metro) AND the rest. Unfiltered
 * featured/pro listings are never injected into a filtered result set.
 *
 * `category` may be a category UUID, name or slug.
 */
export async function getItems({
  collection,
  category,
  specialty,
  tag,
  region,
  state,
  city,
  sortKey,
  reverse,
  query,
  filter,
  currentPage,
  hasSponsorItem,
  excludeFeatured,
  onlineAvailable,
  ageGroups,
  verified,
  priceMax,
  techniqueFocus,
  beginnerFriendly,
  unionStatus,
  itemsPerPage: itemsPerPageOverride,
}: {
  collection?: string;
  category?: string;
  /** Specialty tag filter (e.g. "Improv"); matches saved + derived specialties */
  specialty?: string;
  tag?: string;
  region?: string;
  state?: string;
  city?: string;
  sortKey?: string;
  reverse?: boolean;
  query?: string;
  filter?: string;
  currentPage: number;
  hasSponsorItem?: boolean;
  excludeFeatured?: boolean;
  onlineAvailable?: boolean;
  ageGroups?: string[];
  verified?: boolean;
  priceMax?: number;
  techniqueFocus?: string[];
  beginnerFriendly?: boolean;
  unionStatus?: string;
  itemsPerPage?: number;
}) {
  try {
    const categories = await getCategories();

    // A `q` that is only a place ("TX", "Dallas", "LA") becomes a location filter
    const { location, textQuery } = resolveLocationFilter({
      state,
      city,
      q: query,
    });
    const categoryMatcher =
      category && category !== "all"
        ? buildCategoryMatcher(category, categories)
        : null;

    // State and category are enforced below in JS (tolerant of "TX"/"Texas",
    // category names vs UUIDs). Everything else narrows at the DB.
    const rawListings = await getPublicListings({
      q: textQuery,
      region,
      verified,
      age_groups: ageGroups,
      price_max: priceMax,
      technique_focus: techniqueFocus,
      beginner_friendly: beginnerFriendly,
      union_status: unionStatus,
    });

    let filteredListings = rawListings.filter((l) => {
      if (categoryMatcher && !listingMatchesCategory(l, categoryMatcher)) {
        return false;
      }
      const isOnline =
        l.service_modality === "virtual" || l.service_modality === "hybrid";
      if (location) {
        // "Online Available" explicitly opts virtual providers into a place search
        if (!listingMatchesLocation(l, location) && !(onlineAvailable && isOnline)) {
          return false;
        }
      } else if (onlineAvailable && !isOnline) {
        return false;
      }
      if (excludeFeatured && l.featured) return false;
      return true;
    });

    // Facets for the category page: specialty tags (with counts) across every
    // listing in the category, computed BEFORE the specialty filter is applied.
    const specialtyFacets = categoryMatcher
      ? specialtyCounts(filteredListings)
      : [];
    if (specialty?.trim()) {
      const want = normKey(specialty);
      filteredListings = filteredListings.filter((l) =>
        specialtiesForListing(l).some((sp) => normKey(sp) === want),
      );
    }

    // Same business listed under several category spellings -> keep the best one
    if (categoryMatcher && categoryMatcher.names.has("headshotphotographers")) {
      const nameKey = (n?: string | null) => (n || "").trim().toLowerCase();
      const score = (l: Listing) => {
        const p = (l.plan || "free").toLowerCase();
        const planScore = /pro|premium/.test(p) ? 3 : /standard/.test(p) ? 2 : 1;
        return (
          (l.featured ? 1000 : 0) +
          planScore * 10 +
          (l.comped ? 5 : 0) +
          (l.owner_id ? 2 : 0)
        );
      };
      const byName = new Map<string, Listing>();
      for (const l of filteredListings) {
        const key = nameKey(l.listing_name) || l.id;
        const existing = byName.get(key);
        if (!existing || score(l) > score(existing)) byName.set(key, l);
      }
      filteredListings = Array.from(byName.values());
    }

    // Tag filter (age range)
    if (tag) {
      const tagList = tag.split(",");
      filteredListings = filteredListings.filter(
        (listing) =>
          listing.age_range &&
          tagList.every((t) => listing.age_range?.includes(t)),
      );
    }

    // Free-text location filter
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
    const isVirtualFirst = sortKey === "virtual-first";

    if (isVirtualFirst) {
      // Virtual first: group virtual/hybrid first, then in_person/unknown
      // Preserve original order within each group using stable sort
      const virtualGroup: typeof filteredListings = [];
      const otherGroup: typeof filteredListings = [];
      for (const listing of filteredListings) {
        if (
          listing.service_modality === "virtual" ||
          listing.service_modality === "hybrid"
        ) {
          virtualGroup.push(listing);
        } else {
          otherGroup.push(listing);
        }
      }
      filteredListings = [...virtualGroup, ...otherGroup];
    } else if (isDefaultSort) {
      // Photo listings > placeholder cards, then Featured > Pro > Standard > Free
      const getPlanPriority = (l: Listing) => {
        if (l.comped) return 3; // Comped listings are treated as Pro
        const planLower = (l.plan || "free").toLowerCase();
        if (planLower === "pro" || planLower === "founding pro") return 3;
        if (planLower === "standard" || planLower === "founding standard")
          return 2;
        return 1;
      };
      filteredListings.sort((a, b) => {
        const aPhoto = listingHasPhoto(a);
        const bPhoto = listingHasPhoto(b);
        if (aPhoto !== bPhoto) return aPhoto ? -1 : 1;

        const aFeatured = Boolean(a.featured);
        const bFeatured = Boolean(b.featured);
        if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;

        const aPriority = getPlanPriority(a);
        const bPriority = getPlanPriority(b);
        if (aPriority !== bPriority) return bPriority - aPriority;

        return (a.listing_name || "").localeCompare(b.listing_name || "");
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
    const perPage = itemsPerPageOverride ?? ITEMS_PER_PAGE;
    const itemsPerPage = hasSponsorItem ? perPage - 1 : perPage;
    const page = Math.max(1, Number.isFinite(currentPage) ? currentPage : 1);

    // Pagination
    const offsetStart = (page - 1) * itemsPerPage;
    const paginatedListings = filteredListings.slice(
      offsetStart,
      offsetStart + itemsPerPage,
    );

    // Convert to ItemInfo format
    const items = await Promise.all(
      paginatedListings.map((l) => listingToItem(l, categories)),
    );

    return { items, totalCount, itemsPerPage, specialtyFacets };
  } catch (error) {
    console.error("getItems (Supabase), error:", error);
    return {
      items: [],
      totalCount: 0,
      itemsPerPage: itemsPerPageOverride ?? ITEMS_PER_PAGE,
      specialtyFacets: [] as Array<{ name: string; count: number }>,
    };
  }
}
