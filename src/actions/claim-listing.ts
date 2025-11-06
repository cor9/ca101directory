"use server";

import { auth } from "@/auth";
import { sendAdminClaimNotification } from "@/lib/mail";
import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function claimListing(listingId: string, message?: string) {
  // STEP 1: Verify authentication
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "AUTH_REQUIRED",
      title: "Login Required",
      message: "You must be logged in to claim a listing.",
      action: "Please register or login to continue.",
      redirectTo: `/auth/register?callbackUrl=/listing/${listingId}`,
      showLoginButton: true,
    };
  }

  const supabase = createServerClient();

  // STEP 2: REMOVED - Email confirmation check
  // Magic link authentication already proves email ownership
  // No separate confirmation step needed

  // STEP 3: Get user profile and verify role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      error: "NO_PROFILE",
      title: "Profile Not Found",
      message: "Your user profile is missing. This shouldn't happen!",
      action:
        "Please contact support at support@childactor101.com with your email address.",
      details: profileError?.message,
    };
  }

  if (profile.role === "parent") {
    return {
      success: false,
      error: "WRONG_ROLE",
      title: "Vendor Account Required",
      message:
        "Your account is registered as a Parent. Only Vendor accounts can claim listings.",
      action:
        "If you're a professional offering services, please contact support to change your account type.",
      hint: "Parents can browse and review listings, but cannot claim or manage them.",
    };
  }

  // STEP 4: Fetch and verify listing
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (listingError || !listing) {
    return {
      success: false,
      error: "LISTING_NOT_FOUND",
      title: "Listing Not Found",
      message: "We couldn't find this listing. It may have been removed.",
      action: "Try searching for other listings in the directory.",
      redirectTo: "/listings",
    };
  }

  // STEP 5: Check if already claimed by someone
  if (listing.is_claimed && listing.owner_id) {
    // Check if claimed by THIS user
    if (listing.owner_id === session.user.id) {
      return {
        success: false,
        error: "ALREADY_OWN",
        title: "You Already Own This Listing",
        message: "This listing is already claimed by you!",
        action: "Go to your dashboard to edit your listing.",
        redirectTo: "/dashboard/vendor/listing",
        showDashboardButton: true,
      };
    }
    return {
      success: false,
      error: "ALREADY_CLAIMED",
      title: "Already Claimed",
      message: "This listing has already been claimed by another user.",
      action: "If you believe this is your business, please contact support.",
      hint: "Support email: support@childactor101.com",
    };
  }

  // STEP 6: Check for duplicate claim attempts
  const { data: existingClaim } = await supabase
    .from("claims")
    .select("*")
    .eq("listing_id", listingId)
    .eq("vendor_id", session.user.id)
    .single();

  if (existingClaim) {
    return {
      success: false,
      error: "DUPLICATE_CLAIM",
      title: "Claim Already Submitted",
      message: "You've already submitted a claim for this listing.",
      action:
        "Your claim is being processed. Check your dashboard for updates.",
      redirectTo: "/dashboard/vendor/listing",
    };
  }

  // STEP 7: ALL CHECKS PASSED - Claim the listing!
  try {
    // Update listing with ownership
    const { error: updateError } = await supabase
      .from("listings")
      .update({
        owner_id: session.user.id,
        is_claimed: true,
        date_claimed: new Date().toISOString(),
        claimed_by_email: session.user.email,
      })
      .eq("id", listingId);

    if (updateError) {
      console.error("Claim update error:", updateError);
      return {
        success: false,
        error: "UPDATE_FAILED",
        title: "Claim Failed",
        message: "Failed to claim the listing. Please try again.",
        action: "If the problem persists, contact support.",
        details: updateError.message,
      };
    }

    // Record the claim in claims table
    const { error: claimError } = await supabase.from("claims").insert({
      listing_id: listingId,
      vendor_id: session.user.id,
      message: message || "Listing claimed via instant claim",
      approved: true, // Auto-approved
      created_at: new Date().toISOString(),
    });

    if (claimError) {
      console.error("Claim record error:", claimError);
      // Don't fail - listing is already claimed, this is just record-keeping
    }

    // Revalidate relevant pages
    revalidatePath(`/listing/${listingId}`);
    revalidatePath("/dashboard/vendor/listing");

    // Notify admin (non-blocking)
    try {
      const listingName = listing?.listing_name || listingId;
      await sendAdminClaimNotification(
        listingName,
        listingId,
        session.user.email,
      );
    } catch (notifyError) {
      console.error("Failed to notify admin of claim:", notifyError);
    }

    return {
      success: true,
      title: "Success! 🎉",
      message: "You now own this listing and can edit it immediately.",
      details: "Changes will be reviewed before going live on the directory.",
      redirectTo: "/dashboard/vendor/listing",
      listingId: listingId,
    };
  } catch (error) {
    console.error("Unexpected claim error:", error);
    return {
      success: false,
      error: "UNEXPECTED_ERROR",
      title: "Something Went Wrong",
      message: "An unexpected error occurred while claiming the listing.",
      action: "Please try again or contact support if the problem persists.",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper function to check if user can claim
export async function canUserClaim(listingId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { canClaim: false, reason: "NOT_LOGGED_IN" };
  }

  const supabase = createServerClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("is_claimed, owner_id")
    .eq("id", listingId)
    .single();

  if (!listing) {
    return { canClaim: false, reason: "LISTING_NOT_FOUND" };
  }

  if (listing.is_claimed && listing.owner_id !== session.user.id) {
    return { canClaim: false, reason: "ALREADY_CLAIMED" };
  }

  if (listing.owner_id === session.user.id) {
    return { canClaim: false, reason: "ALREADY_OWN" };
  }

  return { canClaim: true };
}
