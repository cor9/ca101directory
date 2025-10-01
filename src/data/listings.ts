import { supabase } from "@/lib/supabase";

export type Listing = {
  id: string; // UUID
  "Listing Name": string | null;
  "What You Offer?": string | null;
  "Who Is It For?": string | null;
  "Why Is It Unique?": string | null;
  "Format (In-person/Online/Hybrid)": string | null;
  "Extras/Notes": string | null;
  Website: string | null;
  Email: string | null;
  Phone: string | null;
  Region: string | null;
  City: string | null;
  State: string | null;
  Zip: string | null;
  Categories: string | null;
  "Approved 101 Badge": string | null;
  "Profile Image": string | null;
  Active: string | null;
  "Claimed?": string | null;
  "Claimed by? (Email)": string | null;
  Status: string | null;
  "Age Range": string | null;
  Gallery: string | null;
  Plan: string | null;
  "Stripe Plan ID": string | null;
  "California Child Performer Services Permit ": string | null;
  "Bonded For Advanced Fees": string | null;
  "Bond#": string | null;
  "Date Claimed": string | null;
  "Verification Status": string | null;
  "Plan.": string | null;
  Submissions: string | null;
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
