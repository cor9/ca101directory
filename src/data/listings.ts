import { supabase } from "@/lib/supabase";

export type Listing = {
  id: string; // UUID
  listing_name: string | null;
  what_you_offer: string | null;
  who_is_it_for: string | null;
  why_is_it_unique: string | null;
  format: string | null;
  extras_notes: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  region: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  categories: string | null;
  approved_101_badge: boolean | null;
  profile_image: string | null;
  active: boolean | null;
  claimed: boolean | null;
  claimed_by_email: string | null;
  status: string | null;
  age_range: string | null;
  gallery: string | null;
  plan: string | null;
  stripe_plan_id: string | null;
  ca_performer_permit: boolean | null;
  bonded_for_advanced_fees: boolean | null;
  bond_number: string | null;
  date_claimed: string | null;
  verification_status: string | null;
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
  let query = supabase.from("listings").select("*");

  if (params?.state) query = query.eq("State", params.state);
  if (params?.region) query = query.eq("Region", params.region);
  if (params?.city) query = query.eq("City", params.city);
  if (params?.category)
    query = query.ilike("Categories", `%${params.category}%`);
  if (params?.q)
    query = query.or(
      [
        `"Listing Name".ilike.%${params.q}%`,
        `"What You Offer?".ilike.%${params.q}%`,
        `City.ilike.%${params.q}%`,
        `State.ilike.%${params.q}%`,
      ].join(","),
    );

  // Only show approved/active listings (handle both Airtable and Supabase status values)
  query = query.in("Status", ["Live", "APPROVED", "Approved"]).eq("Active", true);

  const { data, error } = await query.order("Listing Name", {
    ascending: true,
  });
  if (error) throw error;
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
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data as Listing;
}
