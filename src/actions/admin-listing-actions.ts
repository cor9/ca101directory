"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function approveListing(listingId: string) {
  try {
    const supabase = createServerActionClient({ cookies });

    const { error } = await supabase
      .from("listings")
      .update({ status: "Live" })
      .eq("id", listingId);

    if (error) throw error;

    revalidatePath("/dashboard/admin/listings");
    revalidatePath("/");

    return { success: true, message: "Listing approved successfully" };
  } catch (error) {
    console.error("Error approving listing:", error);
    return { success: false, message: "Failed to approve listing" };
  }
}

export async function rejectListing(listingId: string) {
  try {
    const supabase = createServerActionClient({ cookies });

    const { error } = await supabase
      .from("listings")
      .update({ status: "Rejected" })
      .eq("id", listingId);

    if (error) throw error;

    revalidatePath("/dashboard/admin/listings");

    return { success: true, message: "Listing rejected successfully" };
  } catch (error) {
    console.error("Error rejecting listing:", error);
    return { success: false, message: "Failed to reject listing" };
  }
}
