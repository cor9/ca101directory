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
