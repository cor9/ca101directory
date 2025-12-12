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
  vendor_email?: string;
  vendor_phone?: string;
}) {
  // First attempt: insert with vendor_email/vendor_phone if columns exist
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
      vendor_email: payload.vendor_email ?? null,
      vendor_phone: payload.vendor_phone ?? null,
      status: "New",
    },
  ]);
  if (error) {
    // Fallback: if schema doesn't have those columns, include them in notes and retry
    const mergedNotes =
      `${payload.notes || ""}`.trim() +
      `${payload.vendor_email ? ` Vendor Email: ${payload.vendor_email}` : ""}` +
      `${payload.vendor_phone ? ` Vendor Phone: ${payload.vendor_phone}` : ""}`;
    const retry = await supabase.from("vendor_suggestions").insert([
      {
        vendor_name: payload.vendor_name,
        website: payload.website ?? null,
        category: payload.category ?? null,
        city: payload.city ?? null,
        state: payload.state ?? null,
        region: payload.region ?? null,
        notes: mergedNotes || null,
        suggested_by: payload.suggested_by ?? null,
        status: "New",
      },
    ]);
    if (retry.error) throw retry.error;
  }
  return true;
}
