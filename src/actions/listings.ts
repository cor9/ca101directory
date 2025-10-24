"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { sendListingLiveEmail } from "@/lib/mail";
import { createClaimToken, createOptOutToken } from "@/lib/tokens";
import { z } from "zod";
import { UpdateListingSchema, CreateListingSchema } from "@/lib/validations/listings";

/**
 * Server action to create a new listing.
 * @param values The form values.
 */
export async function createListing(
  values: z.infer<typeof CreateListingSchema>,
) {
  try {
    const validatedFields = CreateListingSchema.safeParse(values);
    if (!validatedFields.success) {
      return { status: "error", message: "Invalid fields." };
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("listings")
      .insert([validatedFields.data])
      .select()
      .single();

    if (error) {
      console.error("Create Listing Error:", error);
      return {
        status: "error",
        message: "Database Error: Failed to create listing.",
      };
    }

    // Email vendor with individualized claim/upgrade links
    try {
      const email = (validatedFields.data.email || "").trim();
      if (email && data?.id) {
        const token = createClaimToken(data.id);
        const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://directory.childactor101.com";
        const claimUrl = `${siteUrl}/claim/${encodeURIComponent(token)}?lid=${encodeURIComponent(data.id)}`;
        const slug = (validatedFields.data.listing_name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const upgradeUrl = `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(data.id)}&utm_source=email&utm_medium=listing_live`;
        const manageUrl = `${siteUrl}/dashboard/vendor?lid=${encodeURIComponent(data.id)}`;
        const optOutToken = createOptOutToken(data.id);
        const optOutUrl = `${siteUrl}/remove/${encodeURIComponent(optOutToken)}?lid=${encodeURIComponent(data.id)}`;

        await sendListingLiveEmail({
          vendorName: validatedFields.data.listing_name,
          vendorEmail: email,
          listingName: validatedFields.data.listing_name,
          slug,
          listingId: data.id as string,
          claimUrl,
          upgradeUrl,
          manageUrl,
          optOutUrl,
        });
      }
    } catch (notifyErr) {
      console.error("createListing: failed to send listing live email", notifyErr);
    }

    // Revalidate the path to show the new listing in the table
    revalidatePath("/dashboard/admin");
    
    return { status: "success", message: "Listing created successfully." };
  } catch (e) {
    console.error("Unexpected error in createListing:", e);
    return {
      status: "error",
      message: "An unexpected server error occurred.",
    };
  }
}

/**
 * Server action to update a listing.
 * @param id The UUID of the listing to update.
 * @param values The form values.
 */
export async function updateListing(
  id: string,
  values: z.infer<typeof UpdateListingSchema>,
) {
  try {
    console.log("=== UPDATE LISTING START ===");
    console.log("ID:", id);
    console.log("Raw values received:", JSON.stringify(values, null, 2));
    
    const validatedFields = UpdateListingSchema.safeParse(values);
    if (!validatedFields.success) {
      // Log detailed validation errors for debugging
      console.error("=== VALIDATION FAILED ===");
      console.error("Validation errors:", JSON.stringify(validatedFields.error.flatten(), null, 2));
      return { status: "error", message: "Invalid fields." };
    }
    
    console.log("=== VALIDATION SUCCESS ===");
    console.log("Validated fields:", JSON.stringify(validatedFields.data, null, 2));

    console.log("=== CREATING SUPABASE CLIENT ===");
    const supabase = createServerClient();
    
    console.log("=== EXECUTING DATABASE UPDATE ===");
    console.log("Update query:", { 
      table: "listings", 
      id, 
      data: validatedFields.data 
    });
    
    const { data, error } = await supabase
      .from("listings")
      .update(validatedFields.data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("=== DATABASE ERROR ===");
      console.error("Database error:", JSON.stringify(error, null, 2));
      return {
        status: "error",
        message: "Database Error: Failed to update listing.",
      };
    }

    console.log("=== UPDATE SUCCESS ===");
    console.log("Updated data:", JSON.stringify(data, null, 2));

    // Revalidate the path to show the updated data in the table
    revalidatePath("/dashboard/admin");

    return { status: "success", message: "Listing updated successfully.", data };
  } catch (e) {
    console.error("=== UNEXPECTED ERROR ===");
    console.error("Error type:", typeof e);
    console.error("Error message:", e instanceof Error ? e.message : String(e));
    console.error("Error stack:", e instanceof Error ? e.stack : "No stack trace");
    console.error("Full error object:", JSON.stringify(e, null, 2));
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
