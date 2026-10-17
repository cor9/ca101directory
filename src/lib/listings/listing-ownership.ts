/**
 * actions/listings.ts's updateListing() authorization policy: an admin
 * may edit any listing; a non-admin may only edit a listing they already
 * own. Extracted so it can be unit tested directly — see
 * scripts/test-vendor-authorization.ts — since actions/listings.ts is a
 * "use server" module and can only export async server actions.
 */
export function canUpdateListing(params: {
  isAdmin: boolean;
  listingOwnerId: string | null | undefined;
  currentUserId: string;
}): boolean {
  if (params.isAdmin) return true;
  return params.listingOwnerId === params.currentUserId;
}

/**
 * actions/submit-supabase.ts's submitToSupabase() authorization policy
 * for editing an existing listing (isEdit=true): a logged-in user may
 * edit a listing they already own, OR an unclaimed listing (as part of
 * filling it in while claiming it).
 *
 * `currentUserId` is `null | undefined` for a signed-out visitor — both
 * allowances below require it to be a real id. Independent follow-up
 * audit, Task 1: this used to be checked with no authentication
 * requirement at all, so a signed-out visitor who merely knew an
 * unclaimed listing's id (the majority of listings) could edit its
 * content with zero login.
 */
export function canSubmitEditToListing(params: {
  listingOwnerId: string | null | undefined;
  listingIsClaimed: boolean | null | undefined;
  currentUserId: string | null | undefined;
}): boolean {
  if (!params.currentUserId) return false;
  const isClaimingListing =
    params.listingOwnerId === null && !params.listingIsClaimed;
  const ownsListing = params.listingOwnerId === params.currentUserId;
  return isClaimingListing || ownsListing;
}
