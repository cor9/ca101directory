"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for updating a listing
export const UpdateListingSchema = z.object({
  listing_name: z.string().min(1, "Listing name is required."),
  status: z.enum(["Live", "Pending", "Draft", "Archived", "Rejected"]),
  website: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  what_you_offer: z.string().optional(),
  is_claimed: z.boolean(),
});

/**
 * Server action to update a listing.
 * @param id The UUID of the listing to update.
 * @param values The form values.
 */
export async function updateListing(
  id: string,
  values: z.infer<typeof UpdateListingSchema>,
) {
  console.log("updateListing called with:", { id, values });
  try {
    const validatedFields = UpdateListingSchema.safeParse(values);
    console.log("Validation result:", validatedFields);
    if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error);
      return { status: "error", message: "Invalid fields." };
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("listings")
      .update(validatedFields.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update Listing Error:", error);
      return {
        status: "error",
        message: "Database Error: Failed to update listing.",
      };
    }

    // Revalidate the path to show the updated data in the table
    revalidatePath("/dashboard/admin");

    return { status: "success", message: "Listing updated successfully.", data };
  } catch (e) {
    console.error("Unexpected error in updateListing:", e);
    return { status: "error", message: "An unexpected server error occurred." };
  }
}

/**
 * Server action for a vendor to claim an existing, unclaimed listing.
 */
export async function claimListing(listingId: string) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
      return {
        status: "error",
        message: "You must be logged in to claim a listing.",
      };
    }

    const supabase = createServerClient();

    // 1. Check if the listing is already claimed
    const { data: existingListing, error: fetchError } = await supabase
      .from("listings")
      .select("is_claimed, status")
      .eq("id", listingId)
      .single();

    if (fetchError || !existingListing) {
      return { status: "error", message: "Listing not found." };
    }

    if (existingListing.is_claimed) {
      return {
        status: "error",
        message: "This listing has already been claimed.",
      };
    }

    // 2. Update the listing to mark it as claimed by the current user
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        is_claimed: true,
        owner_id: user.id,
        claimed_by_email: user.email,
        date_claimed: new Date().toISOString(),
        status: "Pending", // Set to pending for admin review
      })
      .eq("id", listingId);

    if (updateError) {
      console.error("Claim Listing Error:", updateError);
      return {
        status: "error",
        message: "Database Error: Failed to claim listing.",
      };
    }

    // 3. Revalidate paths to reflect changes
    revalidatePath("/dashboard/admin"); // For admin view
    revalidatePath("/dashboard/vendor/claim"); // For other vendors

    return {
      status: "success",
      message: "Listing claim submitted! An admin will review it shortly.",
    };
  } catch (e) {
    console.error("Unexpected error in claimListing:", e);
    return { status: "error", message: "An unexpected server error occurred." };
  }
}
