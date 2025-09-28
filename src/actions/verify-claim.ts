"use server";

import { currentUser } from "@/lib/auth";
import { sanityClient } from "@/sanity/lib/client";

export async function verifyClaim(token: string) {
  try {
    // Find the claim request by token
    const claimRequest = await sanityClient.fetch(
      `*[_type == "claimRequest" && verificationToken == $token && status == "pending"][0]`,
      { token } as any
    );

    if (!claimRequest) {
      return {
        status: "error",
        message: "Invalid or expired verification token",
      };
    }

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(claimRequest.expiresAt);
    if (now > expiresAt) {
      return { status: "error", message: "Verification token has expired" };
    }

    // Get the listing
    const listing = await sanityClient.fetch(
      `*[_type == "item" && _id == $listingId][0]`,
      { listingId: claimRequest.listing._ref } as any
    );

    if (!listing) {
      return { status: "error", message: "Listing not found" };
    }

    // Check if listing is already claimed
    if (listing.claimedBy) {
      return {
        status: "error",
        message: "This listing has already been claimed",
      };
    }

    // Get current user (if logged in) or create a new user record
    const user = await currentUser();
    let userId = user?.id;

    if (!userId) {
      // Create a new user record for the claimer
      const newUser = await sanityClient.create({
        _type: "user",
        email: claimRequest.email,
        name: claimRequest.businessName,
        role: "vendor",
        emailVerified: new Date().toISOString(),
      });
      userId = newUser._id;
    }

    // Update the listing to mark it as claimed
    await sanityClient
      .patch(listing._id)
      .set({
        claimedBy: {
          _type: "reference",
          _ref: userId,
        },
        claimedAt: new Date().toISOString(),
        claimedEmail: claimRequest.email,
      })
      .commit();

    // Update the claim request status
    await sanityClient
      .patch(claimRequest._id)
      .set({
        status: "verified",
        verifiedAt: new Date().toISOString(),
      })
      .commit();

    return {
      status: "success",
      message: "Listing successfully claimed!",
      listingName: listing.name,
      listingSlug: listing.slug?.current,
    };
  } catch (error) {
    console.error("Verify claim error:", error);
    return { status: "error", message: "Failed to verify claim" };
  }
}
