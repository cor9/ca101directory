import { supabase } from "@/lib/supabase";

export async function claimListingByEmail(listingId: string, email: string) {
  const { error } = await supabase
    .from("listings")
    .update({
      claimed: true,
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
      claimed: true,
      owner_id: userId,
      status: "Pending Review",
    })
    .eq("id", listingId);
  if (error) throw error;
  return true;
}
