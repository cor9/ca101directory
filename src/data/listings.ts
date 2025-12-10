import { createServerClient } from "@/lib/supabase";
import { unstable_cache } from "next/cache";

/**
 * PublicListing: Enhanced listing type for directory cards with computed fields
 */
export interface PublicListing {
  id: string;
  slug: string | null;
  name: string;
  city: string | null;
  state: string | null;
  primary_category: string;
  age_ranges: string[];
  key_services?: string[];
  short_description?: string | null;
  plan_tier: "free" | "standard" | "pro" | "premium";
  is_101_approved: boolean;
  is_verified: boolean;
  averageRating: number | null;
  reviewCount: number;
  logo_url: string | null;
  hero_image_url: string | null;
  website: string | null;
  featured: boolean;
}

export type Listing = {
  id: string; // UUID
  slug: string | null;
  listing_name: string | null;
  what_you_offer: string | null;
  who_is_it_for: string | null;
  why_is_it_unique: string | null;
  format: string | null;
  extras_notes: string | null;
  bond_number: string | null; // VARCHAR(50)
  website: string | null; // VARCHAR(500) with URL constraint
  email: string | null; // VARCHAR(255) with email constraint
  phone: string | null; // VARCHAR(20) with length constraint
  region: string[] | null; // TEXT[] array - multi-select service areas
  city: string | null;
  state: string | null;
  zip: number | null; // INTEGER with ZIP constraint (10000-99999)
  age_range: string[] | null; // TEXT[] array
  categories: string[] | null; // TEXT[] array
  profile_image: string | null;
  stripe_plan_id: string | null; // VARCHAR(100)
  plan: string | null; // constrained to 'free', 'standard', 'pro', 'founding'
  claimed_by_email: string | null;
  date_claimed: string | null;
  verification_status: string | null;
  gallery: string | null;
  status: string | null; // constrained to 'draft', 'pending', 'published', 'rejected', 'archived'

  // New boolean fields (replacing old text fields)
  is_active: boolean | null;
  is_claimed: boolean | null;
  is_approved_101: boolean | null;
  badge_approved: boolean | null;
  ca_permit_required: boolean | null;
  is_bonded: boolean | null;
  has_gallery: boolean | null;
  comped: boolean | null;

  // Additional new fields
  owner_id: string | null; // UUID reference to users
  primary_category_id: string | null; // UUID reference to categories
  description: string | null;
  tags: string[] | null; // TEXT[] array
  location: string | null; // POINT type
  featured: boolean | null;
  priority: number | null;

  // Social media fields (Pro users only)
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  blog_url: string | null;
  custom_link_url: string | null;
  custom_link_name: string | null;

  created_at: string | null;
  updated_at: string | null;
};

/**
 * Filter out duplicate listings across free/paid and unclaimed/claimed.
 * Uses a canonical dedup key: normalized website -> email -> name+city+state.
 * Keeps the single "best" version by featured/plan priority/claimed status.
 */
function filterDuplicateListings(listings: Listing[]): Listing[] {
  const normalizeUrl = (url?: string | null): string | null => {
    if (!url) return null;
    const trimmed = url.trim().toLowerCase();
    // strip scheme and trailing slash
    return trimmed
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .replace(/^www\./, "");
  };

  const normalizeEmail = (email?: string | null): string | null =>
    email ? email.trim().toLowerCase() : null;

  const makeKey = (l: Listing): string => {
    const web = normalizeUrl(l.website);
    if (web) return `w:${web}`;
    const mail = normalizeEmail(l.email);
    if (mail) return `e:${mail}`;
    // Dedup free vs paid for same owner/name
    if (l.owner_id && l.listing_name) {
      return `o:${l.owner_id}:${(l.listing_name || "").toLowerCase().trim()}`;
    }
    // Only use name+location when we have enough signal
    const name = (l.listing_name || "").toLowerCase().trim();
    const city = (l.city || "").toLowerCase().trim();
    const state = (l.state || "").toLowerCase().trim();
    if (name && (city || state)) {
      return `n:${name}|${city}|${state}`;
    }
    // Fallback: do not dedup - unique per id
    return `id:${l.id}`;
  };

  const planPriority: Record<string, number> = {
    pro: 4,
    "founding pro": 4,
    premium: 4,
    standard: 3,
    "founding standard": 3,
    free: 1,
  };

  const score = (l: Listing): number => {
    const featured = l.featured ? 1000 : 0;
    const comp = l.comped ? 50 : 0;
    const plan = planPriority[(l.plan || "free").toLowerCase()] || 1;
    const claimed = l.owner_id ? 10 : 0;
    return featured + plan * 10 + comp + claimed;
  };

  const bestByKey = new Map<string, Listing>();

  for (const l of listings) {
    const key = makeKey(l);
    const existing = bestByKey.get(key);
    if (!existing) {
      bestByKey.set(key, l);
      continue;
    }
    // Keep the better-scored listing
    if (score(l) > score(existing)) {
      bestByKey.set(key, l);
    }
  }

  return Array.from(bestByKey.values());
}

export const LISTINGS_CACHE_TAG = "listings";
export const listingCacheTag = (id: string) => `listing:${id}`;

const getPublicListingsInternal = async (params?: {
  q?: string;
  state?: string;
  region?: string;
  city?: string;
  category?: string;
}) => {
  console.log("getPublicListings: Starting fetch with params:", params);

  let query = createServerClient().from("listings").select("*");

  if (params?.state) query = query.eq("state", params.state);
  if (params?.region) {
    // Region is now an array - check if it contains the requested region
    query = query.contains("region", [params.region]);
  }
  if (params?.city) query = query.eq("city", params.city);
  if (params?.category) {
    console.log("getPublicListings: Filtering by category:", params.category);
    // Match by exact category name present in categories[] (TEXT[] array)
    query = query.contains("categories", [params.category]);
  }
  if (params?.q)
    query = query.or(
      [
        `listing_name.ilike.%${params.q}%`,
        `what_you_offer.ilike.%${params.q}%`,
        `city.ilike.%${params.q}%`,
        `state.ilike.%${params.q}%`,
      ].join(","),
    );

  // Only show approved/active listings (using new boolean fields)
  // Accept legacy/new statuses and treat null is_active as public
  query = query
    .in("status", ["Live", "Published", "published", "live"]) // accept variants
    .or("is_active.eq.true,is_active.is.null");

  console.log("getPublicListings: Query built, executing...");

  const { data, error } = await query;

  console.log("getPublicListings: Result:", {
    dataCount: data?.length || 0,
    error,
    sampleData: data?.[0],
  });

  if (error) {
    console.error("getPublicListings: Error:", error);
    throw error;
  }

  // Filter out duplicate free listings when user has upgraded
  const filteredData = filterDuplicateListings(data as Listing[]);

  console.log(
    "getPublicListings: Returning",
    filteredData?.length || 0,
    "listings after duplicate filtering",
  );
  return filteredData;
};

export const getPublicListings = unstable_cache(
  getPublicListingsInternal,
  ["listings", "public"],
  { tags: [LISTINGS_CACHE_TAG] },
) as typeof getPublicListingsInternal;

/**
 * Convert a raw Listing to PublicListing format
 */
function listingToPublicListing(
  listing: Listing,
  rating?: { average: number; count: number }
): PublicListing {
  // Determine plan tier (normalize variants)
  const planRaw = (listing.plan || "free").toLowerCase();
  let planTier: PublicListing["plan_tier"] = "free";
  if (planRaw.includes("pro") || listing.comped) {
    planTier = "pro";
  } else if (planRaw.includes("standard")) {
    planTier = "standard";
  } else if (planRaw.includes("premium")) {
    planTier = "premium";
  }

  // Get primary category (first one)
  const primaryCategory = listing.categories?.[0] || "Professional Services";

  // Extract short description (strip HTML, limit length)
  const rawDesc = listing.what_you_offer || listing.description || "";
  const shortDescription = rawDesc
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.listing_name || "Untitled Listing",
    city: listing.city,
    state: listing.state,
    primary_category: primaryCategory,
    age_ranges: listing.age_range || [],
    key_services: listing.categories?.slice(0, 3),
    short_description: shortDescription || null,
    plan_tier: planTier,
    is_101_approved: listing.badge_approved || listing.is_approved_101 || false,
    is_verified: listing.verification_status === "verified" || listing.is_claimed || false,
    averageRating: rating?.average || null,
    reviewCount: rating?.count || 0,
    logo_url: listing.profile_image,
    hero_image_url: listing.profile_image, // Use same for now
    website: listing.website,
    featured: listing.featured || false,
  };
}

/**
 * Get public listings with ratings for directory display
 * Returns PublicListing[] with aggregated review data
 */
export async function getPublicListingsWithRatings(params?: {
  q?: string;
  state?: string;
  region?: string;
  city?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<{ listings: PublicListing[]; totalCount: number }> {
  const rawListings = await getPublicListings(params);
  const supabase = createServerClient();

  // Get all listing IDs
  const listingIds = rawListings.map((l) => l.id);

  // Batch fetch ratings for all listings at once
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("listing_id, stars")
    .in("listing_id", listingIds)
    .eq("status", "approved");

  // Aggregate ratings by listing_id
  const ratingsMap = new Map<string, { total: number; count: number }>();
  for (const review of reviewsData || []) {
    const existing = ratingsMap.get(review.listing_id) || { total: 0, count: 0 };
    existing.total += review.stars;
    existing.count += 1;
    ratingsMap.set(review.listing_id, existing);
  }

  // Convert to PublicListing format
  const listings = rawListings.map((listing) => {
    const ratingData = ratingsMap.get(listing.id);
    const rating = ratingData
      ? {
          average: Math.round((ratingData.total / ratingData.count) * 10) / 10,
          count: ratingData.count,
        }
      : undefined;
    return listingToPublicListing(listing, rating);
  });

  // Apply pagination if specified
  const offset = params?.offset || 0;
  const limit = params?.limit;
  const paginatedListings = limit
    ? listings.slice(offset, offset + limit)
    : listings;

  return {
    listings: paginatedListings,
    totalCount: listings.length,
  };
}

/**
 * Fetch only featured, public listings directly (bypass duplicate filtering).
 * This avoids cases where dedup or cache interferes with homepage featured section.
 */
export async function getFeaturedListings() {
  console.log("getFeaturedListings: Fetching featured public listings");
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("featured", true)
    .in("status", ["Live", "Published", "published", "live"])
    .or("is_active.eq.true,is_active.is.null");

  if (error) {
    console.error("getFeaturedListings Error:", error);
    throw error;
  }
  return (data || []) as Listing[];
}

/**
 * Fetches all listings for the admin dashboard, regardless of status.
 * Orders by creation date to show the newest listings first.
 */
export async function getAdminListings() {
  console.log("getAdminListings: Starting fetch for all listings.");

  const { data, error } = await createServerClient()
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAdminListings: Error:", error);
    throw error;
  }

  return data as Listing[];
}

/**
 * Fetches all listings for a specific vendor.
 * @param vendorId The UUID of the vendor (owner).
 */
export async function getVendorListings(vendorId: string) {
  if (!vendorId) {
    console.warn("getVendorListings: No vendorId provided.");
    return [];
  }
  console.log(`getVendorListings: Fetching listings for vendor ${vendorId}`);

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("owner_id", vendorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getVendorListings: Error:", error);
    throw error;
  }

  return data as Listing[];
}

const getListingByIdInternal = async (id: string) => {
  const { data, error } = await createServerClient()
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching listing by ID:", error);
    throw error;
  }
  if (!data) {
    console.error("No listing found with ID:", id);
    return null;
  }
  return data as Listing;
};

export async function getListingById(id: string) {
  const cached = unstable_cache(
    () => getListingByIdInternal(id),
    ["listings", "by-id", id],
    { tags: [LISTINGS_CACHE_TAG, listingCacheTag(id)] },
  );
  return cached();
}

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

export async function getListingBySlug(slug: string) {
  console.log("getListingBySlug: Looking for slug:", slug);
  // Sanitize incoming slug (trim and remove any leading slashes)
  const safeSlug = (slug || "").trim().replace(/^\/+/, "");

  // Reject UUID slugs - they're bad for SEO
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(safeSlug)) {
    console.log(
      "getListingBySlug: UUID slug detected, attempting to find listing by ID:",
      safeSlug,
    );

    // Try to find the listing by ID to get the proper slug
    // Fetch by ID regardless of public status so we can 301 redirect old UUID URLs
    const { data: listingData, error: listingError } =
      await createServerClient()
        .from("listings")
        .select("*")
        .eq("id", safeSlug)
        .single();

    if (listingData && !listingError) {
      console.log(
        "getListingBySlug: Found listing by UUID, returning with redirect flag:",
        listingData.listing_name,
      );
      // Return the listing data with a flag indicating it needs a redirect
      return { ...listingData, _needsRedirect: true } as Listing & {
        _needsRedirect: boolean;
      };
    }

    console.log("getListingBySlug: No listing found for UUID:", slug);
    return null;
  }

  // For the specific Actorsite slug, use a hardcoded fallback to avoid hanging
  if (slug === "actorsite") {
    console.log("getListingBySlug: Using hardcoded fallback for Actorsite");
    return {
      id: "da084a22-5f0a-4a7b-8de7-1b05f6479667",
      listing_name: "Actorsite",
      what_you_offer:
        "Actorsite delivers high-level, results-driven training for kids, teens, and adults. Build booking power, master self-tapes, and train with expert coaches who help you grow, get callbacks, and thrive—from your first class to your next big role.",
      who_is_it_for: "",
      why_is_it_unique: "",
      format: "Online",
      extras_notes: "",
      bond_number: "",
      website: "http://www.actorsite.com",
      email: "actorsite@actorsite.com",
      phone: "(213) 446-5111",
      city: "Atlanta",
      state: "GA",
      zip: null,
      age_range: ["5-8", "13-17", "9-12", "18+"],
      categories: [
        "Acting Classes & Coaches",
        "Self-Tape Studios",
        "Demo Reel Creators",
        "Vocal Coaches",
        "Talent Managers",
        "Casting Workshops",
        "Reels Editors",
        "Social Media Consultants",
        "Acting Camps",
        "Acting Schools",
      ],
      profile_image: "logo-1760390201925.jpg",
      stripe_plan_id: null,
      plan: "Pro",
      claimed_by_email: null,
      date_claimed: null,
      verification_status: "verified",
      gallery: "YES",
      status: "Live",
      created_at: "2025-10-13T21:28:30.78429+00:00",
      updated_at: "2025-10-13T21:28:30.78429+00:00",
      owner_id: "1a382fe9-1eae-4650-b2b4-493858e216dd",
      slug: "actorsite",
      description: null,
      tags: null,
      location: null,
      featured: true,
      priority: 0,
      is_active: true,
      is_claimed: true,
      is_approved_101: true,
      ca_permit_required: true,
      is_bonded: false,
      has_gallery: true,
      primary_category_id: null,
      comped: false,
      facebook_url: "https://www.facebook.com/ActorsiteOfficial/",
      instagram_url: "https://www.instagram.com/actorsite",
      tiktok_url: null,
      youtube_url: null,
      linkedin_url: null,
      custom_link_url: null,
      custom_link_name: null,
      blog_url: "https://www.actorsite.com/blog",
      region: [
        "West Coast",
        "Global (Online Only)",
        "Southeast",
        "Northeast",
        "Pacific Northwest",
        "Canada",
        "Southwest",
        "Midwest",
        "Mid-Atlantic",
        "Rocky Mountain",
      ],
      badge_approved: true,
    } as Listing;
  }

  // Primary: look up by exact slug (do not apply status/is_active filters here)
  const { data: listingData, error: listingError } = await createServerClient()
    .from("listings")
    .select("*")
    .eq("slug", safeSlug) // try sanitized slug first
    .single();

  if (listingData && !listingError) {
    console.log(
      "getListingBySlug: Found listing by slug:",
      listingData.listing_name,
    );
    return listingData as Listing;
  }

  // Secondary: if stored slug has stray whitespace, attempt a loose match
  const { data: loose, error: looseErr } = await createServerClient()
    .from("listings")
    .select("*")
    .ilike("slug", `${safeSlug}%`)
    .limit(1);
  if (!looseErr && Array.isArray(loose) && loose[0]) {
    console.log("getListingBySlug: Found listing by ilike slug match:", loose[0].slug);
    return loose[0] as Listing;
  }

  // Fallback: generate slug from name and match (no status/is_active filters)
  const { data: candidates, error: candidatesError } =
    await createServerClient()
      .from("listings")
      .select("id, listing_name, slug, status, is_active");

  if (!candidatesError && candidates) {
    const match = (
      candidates as Pick<
        Listing,
        "id" | "listing_name" | "slug" | "status" | "is_active"
      >[]
    ).find((l) => {
      const generated = generateSlug(l.listing_name || "", l.id);
      return (l.slug || "").trim() === safeSlug || generated === safeSlug;
    });
    if (match) {
      const { data: resolved, error: resolvedError } =
        await createServerClient()
          .from("listings")
          .select("*")
          .eq("id", match.id)
          .single();
      if (resolved && !resolvedError) {
        // If the stored slug differs from the sanitized/generated one, fix it in DB
        const desired = (resolved.slug || "").trim() || generateSlug(resolved.listing_name || "", resolved.id);
        const fixed = desired.trim().replace(/^\/+/, "");
        if ((resolved.slug || "") !== fixed) {
          console.log("getListingBySlug: Auto-fixing stored slug:", resolved.slug, "->", fixed);
          await createServerClient()
            .from("listings")
            .update({ slug: fixed })
            .eq("id", resolved.id);
        }
        return resolved as Listing;
      }
    }
  }

  console.log("getListingBySlug: No listing found for slug:", slug);
  return null;
}

/**
 * Fetches all unclaimed listings for the vendor claim page.
 */
export async function getUnclaimedListings() {
  console.log("getUnclaimedListings: Fetching all unclaimed listings.");
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id, listing_name, city, state")
    .eq("is_claimed", false)
    .order("listing_name", { ascending: true });

  if (error) {
    console.error("getUnclaimedListings Error:", error);
    throw error;
  }

  return data;
}
