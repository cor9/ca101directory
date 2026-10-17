/**
 * Roles that already have (or are deliberately excluded from) vendor
 * listing-management access. Any other role — "parent", "guest", a
 * missing/null role — is promoted to "vendor" the moment a claim
 * succeeds, since claiming a specific listing is an explicit, verified
 * intent to manage that business.
 *
 * Extracted from actions/claim-listing.ts (a "use server" module, which
 * can only export async server actions) so this decision can be unit
 * tested directly — see scripts/test-vendor-authorization.ts.
 */
export const ROLES_EXEMPT_FROM_VENDOR_PROMOTION: ReadonlyArray<string> = [
  "vendor",
  "admin",
  "rep",
];

/** Whether a successful claim should promote this profile role to "vendor". */
export function shouldPromoteToVendor(
  role: string | null | undefined,
): boolean {
  return !ROLES_EXEMPT_FROM_VENDOR_PROMOTION.includes(role ?? "");
}
