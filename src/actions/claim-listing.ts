"use server";

import { auth, unstable_update } from "@/auth";
import {
  LISTINGS_CACHE_TAG,
  getListingById,
  listingCacheTag,
} from "@/data/listings";
import {
  type ClaimListingCoreResult,
  type ClaimSupabaseClient,
  performListingClaim,
} from "@/lib/listings/claim-listing-core";
import { sendAdminClaimNotification } from "@/lib/mail";
import { createServerClient } from "@/lib/supabase";
import type { UserRole } from "@/types/user-role";
import { revalidatePath, revalidateTag } from "next/cache";

// Explicit, single return type for every branch below (login-required,
// unexpected error, and every variant performListingClaim can return) —
// without it, TypeScript infers a loose union from the scattered return
// statements that doesn't narrow cleanly on `result.success` for
// callers (see components/claim/claim-form.tsx).
export type ClaimListingResponse =
  | ClaimListingCoreResult
  | {
      success: false;
      error: "AUTH_REQUIRED" | "UNEXPECTED_ERROR";
      title: string;
      message: string;
      action?: string;
      redirectTo?: string;
      showLoginButton?: boolean;
      details?: string;
    };

export async function claimListing(
  listingId: string,
  message?: string,
): Promise<ClaimListingResponse> {
  // STEP 1: Verify authentication. Not a database call, so it stays here
  // rather than in the DB-focused core (lib/listings/claim-listing-core.ts).
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "AUTH_REQUIRED",
      title: "Login Required",
      message: "You must be logged in to claim a listing.",
      action: "Please register or login to continue.",
      redirectTo: `/auth/register?callbackUrl=${encodeURIComponent(`/claim/listing/${listingId}`)}`,
      showLoginButton: true,
    };
  }

  // STEP 2: REMOVED - Email confirmation check
  // Magic link authentication already proves email ownership
  // No separate confirmation step needed

  // Parent/guest accounts are no longer blocked here: a successful claim
  // promotes them to "vendor" automatically (see claim-listing-core.ts)
  // so they land in an account that can actually manage the listing they
  // just claimed.
  try {
    // Cast: the real supabase-js client's generics are far deeper than
    // this test-seam interface needs (see update-listing-core.ts for the
    // same situation) and TypeScript gives up trying to structurally
    // match them. Runtime shape is identical.
    const supabase = createServerClient() as unknown as ClaimSupabaseClient;
    const result = await performListingClaim(
      supabase,
      { id: session.user.id, email: session.user.email },
      listingId,
      message,
    );

    if (!result.success) {
      return result;
    }

    if (result.promotedToVendor) {
      try {
        await unstable_update({
          user: { ...session.user, role: "vendor" as UserRole },
        });
      } catch (sessionError) {
        // Non-fatal: the next auth() call refetches role from profiles.
        console.error(
          "Claim: failed to refresh session after role promotion:",
          sessionError,
        );
      }
    }

    // Revalidate relevant pages
    let slugToRevalidate: string | null = null;
    try {
      const canonical = await getListingById(listingId);
      slugToRevalidate = canonical?.slug ?? null;
    } catch (slugError) {
      console.error(
        "Failed to resolve listing slug during claim revalidation:",
        slugError,
      );
    }

    if (slugToRevalidate) {
      revalidatePath(`/listing/${slugToRevalidate}`);
    }
    revalidatePath("/dashboard/vendor/listing");
    revalidateTag(LISTINGS_CACHE_TAG);
    revalidateTag(listingCacheTag(listingId));

    // Notify admin (non-blocking)
    try {
      const listingName =
        (result.listing?.listing_name as string | undefined) || listingId;
      await sendAdminClaimNotification(
        listingName,
        listingId,
        session.user.email,
      );
    } catch (notifyError) {
      console.error("Failed to notify admin of claim:", notifyError);
    }

    return result;
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
