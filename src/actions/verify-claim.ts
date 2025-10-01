"use server";

import { claimListingByEmail, claimListingByUserId } from "@/data/claims";
import { getListingById } from "@/data/listings";
import { currentUser } from "@/lib/auth";

export async function verifyClaim(token: string) {
  try {
    // Extract listing slug from token (this is a simplified approach)
    // In production, you'd store the token with the claim request in a database

    // For demo purposes, we'll assume the token contains the listing slug
    // This is NOT secure for production - just for demonstration

    const listingSlug = token; // Simplified - in production, decode from token

    // Convert slug back to business name
    const businessName = listingSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Get the listing
    const listing = await getListingById(token);

    if (!listing) {
      return {
        status: "error",
        message: "Listing not found",
      };
    }

    // Check if listing is already claimed
    if (listing["Claimed?"] === "checked") {
      return {
        status: "error",
        message: "This listing has already been claimed",
      };
    }

    // Get current user (if logged in) or create a new user record
    const user = await currentUser();
    let userId = user?.id;

    if (!userId) {
      // For now, we'll use the email as a simple identifier
      // In production, you'd create a proper user record
      userId = `user_${Date.now()}`;
    }

    // Update the listing in Supabase to mark it as verified
    const success = user?.id
      ? await claimListingByUserId(listing.id, user.id)
      : await claimListingByEmail(
          listing.id,
          user?.email || "unknown@example.com",
        );

    if (!success) {
      return {
        status: "error",
        message: "Failed to update listing claim status",
      };
    }

    return {
      status: "success",
      message: "Listing successfully claimed and verified!",
      listingName: listing["Listing Name"],
      listingSlug: listingSlug,
    };
  } catch (error) {
    console.error("Verify claim error:", error);
    return { status: "error", message: "Failed to verify claim" };
  }
}
