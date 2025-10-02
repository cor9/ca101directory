import { supabase } from "@/lib/supabase";

export async function claimListingByEmail(listingId: string, email: string) {
  const { error } = await supabase
    .from("listings")
    .update({
      claimed: "checked",
      claimed_by_email: email,
      status: "Pending Review",
    })
    .eq("id", listingId);
  if (error) throw error;
  return true;
}

export async function claimListingByUserId(listingId: string, userId: string) {
  const { error } = await supabase
    .from("listings")
    .update({
      claimed: "checked",
      owner_id: userId,
      status: "Pending Review",
    })
    .eq("id", listingId);
  if (error) throw error;
  return true;
}
