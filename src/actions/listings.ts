"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const commaSeparatedStringToArray = z
  .string()
  .optional()
  .transform((val) =>
    val ? val.split(",").map((s) => s.trim()).filter(Boolean) : [],
  );

// Schema for updating a listing
export const UpdateListingSchema = z.object({
  listing_name: z.string().min(1, "Listing name is required."),
  status: z.enum(["Live", "Pending", "Draft", "Archived", "Rejected"]),
  website: z.union([z.string().url({ message: "Invalid URL format." }), z.literal("")]).optional(),
  email: z.union([z.string().email({ message: "Invalid email format." }), z.literal("")]).optional(),
  phone: z.string().optional(),
  what_you_offer: z.string().optional(),
  is_claimed: z.boolean(),
  // Extended fields for comprehensive admin editing
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  facebook_url: z.union([z.string().url({ message: "Invalid URL format." }), z.literal("")]).optional(),
  instagram_url: z.union([z.string().url({ message: "Invalid URL format." }), z.literal("")]).optional(),
  plan: z.string().optional(),
  is_active: z.boolean(),
  featured: z.boolean(),
  // Detailed Profile Fields
  who_is_it_for: z.string().optional(),
  why_is_it_unique: z.string().optional(),
  format: z.string().optional(),
  extras_notes: z.string().optional(),
  // Array fields handled with transform
  categories: commaSeparatedStringToArray,
  age_range: commaSeparatedStringToArray,
  region: commaSeparatedStringToArray,
});

// Schema for creating a new listing
export const CreateListingSchema = z.object({
  listing_name: z.string().min(1, "Listing name is required."),
  status: z.enum(["Live", "Pending", "Draft", "Archived", "Rejected"]),
  website: z.union([z.string().url({ message: "Invalid URL format." }), z.literal("")]).optional(),
  email: z.union([z.string().email({ message: "Invalid email format." }), z.literal("")]).optional(),
  phone: z.string().optional(),
  what_you_offer: z.string().optional(),
});

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
    const { error } = await supabase
      .from("listings")
      .insert([validatedFields.data]);

    if (error) {
      console.error("Create Listing Error:", error);
      return {
        status: "error",
        message: "Database Error: Failed to create listing.",
      };
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
