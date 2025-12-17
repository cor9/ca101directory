export type ListingType = "SERVICE_VENDOR" | "INDUSTRY_PRO" | "REGULATED_PRO";

export const isIndustryPro = (t?: string | null) => t === "INDUSTRY_PRO";
export const isRegulatedPro = (t?: string | null) => t === "REGULATED_PRO";
export const isServiceVendor = (t?: string | null) => !t || t === "SERVICE_VENDOR";

/**
 * Centralized "is featured" check.
 * A listing is featured if:
 * - featured === true, OR
 * - plan is Pro/Founding Pro/Premium, OR
 * - comped === true
 */
export function isFeaturedListing(listing: {
  featured?: boolean | null;
  plan?: string | null;
  comped?: boolean | null;
}): boolean {
  if (listing.featured === true) return true;
  if (listing.comped === true) return true;
  const plan = (listing.plan || "").toLowerCase();
  return plan.includes("pro") || plan.includes("premium");
}
