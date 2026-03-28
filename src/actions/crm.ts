"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getCrmListings() {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("listings")
    .select(`
      id, slug, listing_name, email, views_count, favorites_count, plan, is_claimed,
      vendor_outreach:vendor_outreach(status, notes, last_contacted_at)
    `)
    .eq("plan", "Free")
    .eq("status", "Live")
    .order("views_count", { ascending: false });

  if (error) {
    console.error("Error fetching CRM listings:", error);
    return [];
  }
  return data;
}

export async function updateCrmStatus(
  listingId: string,
  status: string,
  notes: string = ""
) {
  const supabase = createServerClient();

  const { error } = await supabase
    .from("vendor_outreach")
    .upsert({
      listing_id: listingId,
      status: status,
      notes: notes,
      last_contacted_at: new Date().toISOString(),
    }, { onConflict: "listing_id" });

  if (error) {
    console.error("Error updating CRM status:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/admin/crm");
  return { success: true };
}
