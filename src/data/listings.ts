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
  ca_permit: string | null;
  bonded: string | null;
  bond_number: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  region: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  age_range: string | null;
  categories: string | null;
  approved_101_badge: string | null;
  profile_image: string | null;
  stripe_plan_id: string | null;
  plan: string | null;
  comped: boolean | null;
  active: string | null;
  claimed: string | null;
  claimed_by_email: string | null;
  date_claimed: string | null;
  verification_status: string | null;
  gallery: string | null;
  plan_duplicate: string | null; // Appears to be a duplicate/legacy field from Airtable
  submissions: string | null; // Appears to be a duplicate/legacy field from Airtable
  status: string | null;
  owner_id: string | null; // UUID reference to profiles
  plan_id: string | null; // UUID reference to plans
  category_id: string | null; // UUID reference to categories
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
    query = query.ilike("categories", `%${params.category}%`);
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

  // Only show approved/active listings (handle both Airtable and Supabase status values)
  query = query
    .in("status", ["Live", "APPROVED", "Approved"])
    .eq("active", "checked");

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
    .in("status", ["Live", "APPROVED", "Approved"])
    .eq("active", "checked");

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
