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
 * /api/create-checkout-session's authorization policy: a signed-in user
 * may start a Pro checkout for a listing they already own, or for an
 * unclaimed listing IF they presented a claim token that was already
 * verified (by the caller, via lib/tokens.ts's verifyClaimToken) to
 * match that specific listing. A listing already owned by someone else
 * is never purchasable, token or not — a token can't override an
 * existing, independent ownership fact.
 *
 * Independent follow-up audit, Task 2: this route had no such check at
 * all. `token` was optional and, when absent, the route trusted
 * `listingId` outright — a signed-in vendor could POST an ARBITRARY
 * listing id (copied from any public directory page) with no token and
 * no ownership check, pay $399, and the webhook's fulfillment logic
 * (which DOES check for a conflicting existing owner, but has no
 * concept of "is this payer allowed to claim this listing") would set
 * them as owner + Pro on an unclaimed listing that was never theirs to
 * claim — bypassing the real claim flow's role/duplicate/ownership
 * checks entirely. For an already-claimed listing the webhook's
 * conflict check does prevent ownership transfer, but the payer's money
 * is still taken with nothing granted in return.
 */
export function canPurchaseProForListing(params: {
  listingOwnerId: string | null | undefined;
  currentUserId: string;
  hasValidClaimToken: boolean;
}): boolean {
  if (params.listingOwnerId === params.currentUserId) return true;
  if (params.listingOwnerId) return false;
  return params.hasValidClaimToken;
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
