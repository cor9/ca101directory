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
    // categories contains array of words that can be combined to match category names
    // Check if the category name is contained in any combination of the categories array
    query = query.or(`categories.cs.{${params.category}},categories.cd.{${params.category}}`);
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
  query = query
    .eq("status", "published")
    .eq("is_active", true);

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

  console.log("getPublicListings: Returning", data?.length || 0, "listings");
  return data as Listing[];
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
  if (slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    console.log("getListingBySlug: Treating as UUID");
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", slug)
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
    .eq("status", "published")
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
      match: generatedSlug === slug
    });
    
    return generatedSlug === slug;
  });

  if (listing) {
    console.log("getListingBySlug: Found by generated slug:", listing.listing_name);
    return listing as Listing;
  }

  console.log("getListingBySlug: No listing found for slug:", slug);
  return null;
}
