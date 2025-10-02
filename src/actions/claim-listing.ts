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
    };

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

    // Insert the claim
    const { data, error } = await supabase
      .from("claims")
      .insert({
        listing_id: formData.listingId,
        vendor_id: session.user.id,
        message: formData.message,
        approved: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error submitting claim:", error);
      return {
        success: false,
        message: "Failed to submit claim. Please try again.",
      };
    }

    console.log("✅ Claim submitted successfully:", data.id);

    return {
      success: true,
      message:
        "Your claim has been submitted for review. We'll notify you when it's approved.",
      claimId: data.id,
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
