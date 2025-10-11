"use server";

import { auth } from "@/auth";
import type { ClaimListingFormData } from "@/lib/schemas";
import { createServerClient } from "@/lib/supabase";

export async function claimListing(formData: ClaimListingFormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to claim a listing.",
      };
    }

    const supabase = createServerClient();

    // Check if listing exists and is not already claimed
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, is_claimed, owner_id")
      .eq("id", formData.listingId)
      .single();

    if (listingError || !listing) {
      return {
        success: false,
        message: "Listing not found.",
      };
    }

    if (listing.is_claimed === true) {
      return {
        success: false,
        message: "This listing has already been claimed.",
      };
    }

    if (listing.owner_id === session.user.id) {
      return {
        success: false,
        message: "You already own this listing.",
      };
    }

    // Check if user has already submitted a claim for this listing
    const { data: existingClaim } = await supabase
      .from("claims")
      .select("id")
      .eq("listing_id", formData.listingId)
      .eq("vendor_id", session.user.id)
      .single();

    if (existingClaim) {
      return {
        success: false,
        message: "You have already submitted a claim for this listing.",
      };
    }

    // AUTO-APPROVE: Immediately claim the listing for the user
    // Step 1: Update the listing with ownership
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        owner_id: session.user.id,
        is_claimed: true,
        date_claimed: new Date().toISOString(),
        claimed_by_email: session.user.email,
      })
      .eq("id", formData.listingId);

    if (updateError) {
      console.error("Error claiming listing:", updateError);
      return {
        success: false,
        message: "Failed to claim listing. Please try again.",
      };
    }

    // Step 2: Create a claim record for tracking (auto-approved)
    const { data, error } = await supabase
      .from("claims")
      .insert({
        listing_id: formData.listingId,
        vendor_id: session.user.id,
        message: formData.message,
        approved: true, // Auto-approved
      })
      .select()
      .single();

    if (error) {
      console.error("Error recording claim:", error);
      // Don't fail if claim record fails - listing is already claimed
    }

    console.log("✅ Listing claimed successfully (auto-approved)");

    return {
      success: true,
      message:
        "Success! You now own this listing and can edit it immediately. Changes will be reviewed before going live.",
      claimId: data?.id,
    };
  } catch (error) {
    console.error("❌ Error submitting claim:", error);

    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
