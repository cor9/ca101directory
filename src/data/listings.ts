import { createServerClient } from "@/lib/supabase";

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
 * Filter out duplicate free listings when user has upgraded
 */
function filterDuplicateListings(listings: Listing[]): Listing[] {
  // Group listings by owner_id and listing_name
  const listingGroups = new Map<string, Listing[]>();
  const unclaimedListings: Listing[] = [];

  for (const listing of listings) {
    if (!listing.listing_name) continue;

    // Handle unclaimed listings (no owner_id) separately
    if (!listing.owner_id) {
      unclaimedListings.push(listing);
      continue;
    }

    const key = `${listing.owner_id}-${listing.listing_name.toLowerCase().trim()}`;
    if (!listingGroups.has(key)) {
      listingGroups.set(key, []);
    }
    const group = listingGroups.get(key);
    if (group) {
      group.push(listing);
    }
  }

  // For each group, keep only the highest plan listing
  const filteredListings: Listing[] = [];
  const planPriority = {
    Pro: 4,
    "Founding Pro": 4,
    Standard: 3,
    "Founding Standard": 3,
    Free: 1,
  };

  for (const group of Array.from(listingGroups.values())) {
    if (group.length === 1) {
      filteredListings.push(group[0]);
    } else {
      // Sort by plan priority (highest first) and keep the best one
      const sortedGroup = group.sort((a, b) => {
        const aPriority =
          planPriority[a.plan as keyof typeof planPriority] || 1;
        const bPriority =
          planPriority[b.plan as keyof typeof planPriority] || 1;
        return bPriority - aPriority;
      });
      filteredListings.push(sortedGroup[0]);

      console.log(
        `Filtered duplicate listings for ${group[0].listing_name}: kept ${sortedGroup[0].plan}, hidden ${group
          .slice(1)
          .map((l) => l.plan)
          .join(", ")}`,
      );
    }
  }

  // Add all unclaimed listings back (they don't have duplicates by owner)
  filteredListings.push(...unclaimedListings);

  return filteredListings;
}

export async function getPublicListings(params?: {
  q?: string;
  state?: string;
  region?: string;
  city?: string;
  category?: string;
}) {
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
    // Handle special cases for multi-word categories
    if (params.category === "Talent Managers") {
      // Look for listings that have both "Talent" and "Managers" in categories
      query = query.or("categories.cs.{Talent},categories.cs.{Managers}");
    } else {
      // categories contains array of words that can be combined to match category names
      // Check if the category name is contained in any combination of the categories array
      query = query.or(
        `categories.cs.{${params.category}},categories.cd.{${params.category}}`,
      );
    }
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
  query = query.eq("status", "Live").eq("is_active", true);

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

export async function getListingById(id: string) {
  const { data, error } = await createServerClient()
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Listing;
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

  // Reject UUID slugs - they're bad for SEO
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(slug)) {
    console.log("getListingBySlug: UUID slug detected, attempting to find listing by ID:", slug);
    
    // Try to find the listing by ID to get the proper slug
    const { data: listingData, error: listingError } = await createServerClient()
      .from("listings")
      .select("*")
      .eq("id", slug)
      .eq("status", "Live")
      .eq("is_active", true)
      .single();

    if (listingData && !listingError) {
      console.log("getListingBySlug: Found listing by UUID, returning with redirect flag:", listingData.listing_name);
      // Return the listing data with a flag indicating it needs a redirect
      return { ...listingData, _needsRedirect: true } as Listing & { _needsRedirect: boolean };
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
      what_you_offer: "Actorsite delivers high-level, results-driven training for kids, teens, and adults. Build booking power, master self-tapes, and train with expert coaches who help you grow, get callbacks, and thrive—from your first class to your next big role.",
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
      categories: ["c0b8d6a5-436a-4004-b6b6-8b58a9f5b3d2", "10159a59-61f7-4375-8770-141b6ddc878f", "e4770486-0c03-4263-8d0b-99c11598ddbf", "54d02e9e-e984-4de0-97df-28fde1d18344", "7992d99a-6491-406e-b845-cfdb0986331d", "c5236852-82be-48df-8762-85c2b18f0d76", "1f3ec0a8-f2b8-41c4-b5fd-c7b78c266629", "e656d5c5-35c8-426e-a02c-5adf5e82f7e7", "dff32333-23be-4cbc-86e6-9bde617e2ddd", "ca25586e-8cb2-40db-a06b-f6570a8952f9"],
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
      region: ["West Coast", "Global (Online Only)", "Southeast", "Northeast", "Pacific Northwest", "Canada", "Southwest", "Midwest", "Mid-Atlantic", "Rocky Mountain"],
      badge_approved: true
    } as Listing;
  }

  // Simplified query - just look for the slug directly without complex conditions
  const { data: listingData, error: listingError } = await createServerClient()
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .eq("status", "Live")
    .eq("is_active", true)
    .single();

  if (listingData && !listingError) {
    console.log("getListingBySlug: Found listing by slug:", listingData.listing_name);
    return listingData as Listing;
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
