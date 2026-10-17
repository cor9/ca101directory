import { shouldPromoteToVendor } from "@/lib/auth/vendor-promotion";
import type { SupabaseFilterBuilder } from "@/lib/listings/update-listing-core";

/**
 * Loose shape covering the chainable methods actions/claim-listing.ts's
 * claimListing() actually calls. See update-listing-core.ts for why this
 * is typed loosely rather than against @supabase/supabase-js directly.
 */
export interface ClaimSupabaseClient {
  from(table: string): {
    select(cols?: string): SupabaseFilterBuilder;
    update(payload: Record<string, unknown>): SupabaseFilterBuilder;
    insert(payload: Record<string, unknown>): unknown;
  };
}

/**
 * Mirrors the exact response shape actions/claim-listing.ts's
 * claimListing() has always returned to its callers (ClaimForm,
 * claim-listing-client.tsx) for every branch EXCEPT the "not logged in"
 * case, which the thin wrapper in actions/claim-listing.ts still checks
 * itself before ever calling this function (auth() isn't a database
 * call, so it has no reason to live in this DB-focused core).
 */
export type ClaimListingCoreResult =
  | {
      success: true;
      title: string;
      message: string;
      details: string;
      redirectTo: string;
      listingId: string;
      promotedToVendor: boolean;
      listing: Record<string, unknown>;
    }
  | {
      success: false;
      error: string;
      title: string;
      message: string;
      action?: string;
      redirectTo?: string;
      redirectLabel?: string;
      showDashboardButton?: boolean;
      hint?: string;
      details?: string;
    };

/**
 * The full authorization + write path for claimListing(), independent of
 * NextAuth (auth()/unstable_update), Next.js's cache APIs, and outbound
 * email so it can be unit tested directly — see
 * scripts/test-webhook-and-ownership.ts. actions/claim-listing.ts calls
 * this once the caller is already known to be authenticated, then
 * refreshes the session, revalidates paths, and notifies admins on a
 * successful result.
 *
 * Security property this closes (independent follow-up audit, Task 1):
 * the original code checked `listing.is_claimed` with a SELECT, then
 * separately ran an UPDATE with no re-check of that condition at the
 * write itself. Two requests claiming the same unclaimed listing within
 * that window could BOTH pass the check and both successfully write —
 * a lost-update race that could leave two different accounts believing
 * they own the same listing (the second write wins silently, with no
 * error surfaced to the first). The UPDATE below now also filters on
 * `.eq("is_claimed", false)`, so a listing claimed by a concurrent
 * request in that window causes this write to affect zero rows, which
 * is treated as a failed claim (asking the user to retry) rather than a
 * successful one.
 */
export async function performListingClaim(
  supabase: ClaimSupabaseClient,
  actor: { id: string; email: string | null | undefined },
  listingId: string,
  message?: string,
): Promise<ClaimListingCoreResult> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", actor.id)
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
      redirectTo: "/directory",
    };
  }

  if (listing.is_claimed && listing.owner_id) {
    if (listing.owner_id === actor.id) {
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

  // .single() returns an error (and null data) when no claim exists yet
  // — that error is intentionally ignored here, matching the original
  // behavior: a missing row is the expected, non-error case for "no
  // duplicate claim on file".
  const { data: existingClaim } = await supabase
    .from("claims")
    .select("*")
    .eq("listing_id", listingId)
    .eq("vendor_id", actor.id)
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

  // Atomic claim: re-asserts is_claimed = false AT THE WRITE, closing the
  // double-claim race described above.
  const { data: claimedRow, error: updateError } = await supabase
    .from("listings")
    .update({
      owner_id: actor.id,
      is_claimed: true,
      date_claimed: new Date().toISOString(),
      claimed_by_email: actor.email ?? null,
    })
    .eq("id", listingId)
    .eq("is_claimed", false)
    .select()
    .single();

  if (updateError || !claimedRow) {
    return {
      success: false,
      error: "UPDATE_FAILED",
      title: "Claim Failed",
      message:
        "Failed to claim the listing — it may have just been claimed by someone else. Please try again.",
      action: "If the problem persists, contact support.",
      details: updateError?.message,
    };
  }

  const promotedToVendor = shouldPromoteToVendor(profile.role);
  if (promotedToVendor) {
    await supabase
      .from("profiles")
      .update({ role: "vendor", updated_at: new Date().toISOString() })
      .eq("id", actor.id)
      .select()
      .single();
  }

  // Record-keeping only; failure here doesn't undo the claim above (the
  // listing is already claimed), matching the original behavior.
  await supabase.from("claims").insert({
    listing_id: listingId,
    vendor_id: actor.id,
    message: message || "Listing claimed via instant claim",
    approved: true,
    created_at: new Date().toISOString(),
  });

  return {
    success: true,
    title: "Success! 🎉",
    message: "You now own this listing and can edit it immediately.",
    details: "Changes will be reviewed before going live on the directory.",
    redirectTo: "/dashboard/vendor/listing",
    listingId,
    promotedToVendor,
    listing: claimedRow,
  };
}
