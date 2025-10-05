import { supabase } from "@/lib/supabase";

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
  region: string | null;
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

  created_at: string | null;
  updated_at: string | null;
};

/**
 * Filter out duplicate free listings when user has upgraded
 */
function filterDuplicateListings(listings: Listing[]): Listing[] {
  // Group listings by owner_id and listing_name
  const listingGroups = new Map<string, Listing[]>();
  
  for (const listing of listings) {
    if (!listing.owner_id || !listing.listing_name) continue;
    
    const key = `${listing.owner_id}-${listing.listing_name.toLowerCase().trim()}`;
    if (!listingGroups.has(key)) {
      listingGroups.set(key, []);
    }
    listingGroups.get(key)!.push(listing);
  }
  
  // For each group, keep only the highest plan listing
  const filteredListings: Listing[] = [];
  const planPriority = { 'Pro': 4, 'Founding Pro': 4, 'Standard': 3, 'Founding Standard': 3, 'Free': 1 };
  
  for (const group of Array.from(listingGroups.values())) {
    if (group.length === 1) {
      filteredListings.push(group[0]);
    } else {
      // Sort by plan priority (highest first) and keep the best one
      const sortedGroup = group.sort((a, b) => {
        const aPriority = planPriority[a.plan as keyof typeof planPriority] || 1;
        const bPriority = planPriority[b.plan as keyof typeof planPriority] || 1;
        return bPriority - aPriority;
      });
      filteredListings.push(sortedGroup[0]);
      
      console.log(`Filtered duplicate listings for ${group[0].listing_name}: kept ${sortedGroup[0].plan}, hidden ${group.slice(1).map(l => l.plan).join(', ')}`);
    }
  }
  
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

  let query = supabase.from("listings").select("*");

  if (params?.state) query = query.eq("state", params.state);
  if (params?.region) query = query.eq("region", params.region);
  if (params?.city) query = query.eq("city", params.city);
  if (params?.category) {
    console.log("getPublicListings: Filtering by category:", params.category);
    // Handle special cases for multi-word categories
    if (params.category === "Talent Managers") {
      // Look for listings that have both "Talent" and "Managers" in categories
      query = query.or(`categories.cs.{Talent},categories.cs.{Managers}`);
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

  const { data, error } = await query.order("listing_name", {
    ascending: true,
  });

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

  console.log("getPublicListings: Returning", filteredData?.length || 0, "listings after duplicate filtering");
  return filteredData;
}

export async function getListingById(id: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Listing;
}

export async function getListingBySlug(slug: string) {
  console.log("getListingBySlug: Looking for slug:", slug);

  // First try to find by UUID (if it looks like a UUID)
  if (
    slug.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    )
  ) {
    console.log("getListingBySlug: Treating as UUID");
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", slug)
      .eq("status", "Live")
      .eq("is_active", true)
      .single();

    if (data && !error) {
      console.log("getListingBySlug: Found by UUID:", data.listing_name);
      return data as Listing;
    }
    console.log("getListingBySlug: UUID not found, trying slug lookup");
  }

  // If not found by UUID, try to find by generated slug from listing_name
  const { data: nameData, error: nameError } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "Live")
    .eq("is_active", true);

  if (nameError) {
    console.error("getListingBySlug: Error fetching listings:", nameError);
    throw nameError;
  }

  console.log("getListingBySlug: Checking", nameData?.length || 0, "listings");

  // Find listing where generated slug matches
  const listing = nameData?.find((item) => {
    const generatedSlug =
      item.listing_name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || item.id;

    console.log("getListingBySlug: Comparing", {
      listingName: item.listing_name,
      generatedSlug,
      targetSlug: slug,
      match: generatedSlug === slug,
    });

    return generatedSlug === slug;
  });

  if (listing) {
    console.log(
      "getListingBySlug: Found by generated slug:",
      listing.listing_name,
    );
    return listing as Listing;
  }

  console.log("getListingBySlug: No listing found for slug:", slug);
  return null;
}
