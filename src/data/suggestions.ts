import { supabase } from "@/lib/supabase";

export async function createVendorSuggestion(payload: {
  vendor_name: string;
  website?: string;
  category?: string;
  city?: string;
  state?: string;
  region?: string;
  notes?: string;
  suggested_by?: string; // email
}) {
  const { error } = await supabase.from("vendor_suggestions").insert([
    {
      vendor_name: payload.vendor_name,
      website: payload.website ?? null,
      category: payload.category ?? null,
      city: payload.city ?? null,
      state: payload.state ?? null,
      region: payload.region ?? null,
      notes: payload.notes ?? null,
      suggested_by: payload.suggested_by ?? null,
      status: "New",
    },
  ]);
  if (error) throw error;
  return true;
}
