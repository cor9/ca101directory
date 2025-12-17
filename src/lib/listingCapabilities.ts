/**
 * Listing Capabilities Resolver
 *
 * Gating is based on the LISTING's tier (what the vendor pays for),
 * NOT the viewer's tier. Parents aren't paying to browse - vendors
 * are paying to be contacted.
 *
 * Permission Matrix (source of truth):
 * - FREE: email/phone/website visible text only, no mailto/tel, no links
 * - STANDARD: website + socials clickable, email/phone visible text only
 * - PRO: tel/mailto enabled, website/socials clickable, lead modal available
 */

export type ListingTier = "free" | "standard" | "pro" | "premium";

export type ViewerContext = {
  isAdmin?: boolean;
  isLoggedIn?: boolean; // parent account
};

export type ListingCapabilities = {
  canClickWebsite: boolean;
  canClickSocials: boolean;
  canClickEmail: boolean;
  canClickPhone: boolean;
  showLeadForm: boolean;
  obfuscateEmail: boolean;
  obfuscatePhone: boolean;
  cta: "VIEW_PROFILE" | "VISIT_WEBSITE" | "CONTACT_MODAL";
};

/**
 * Normalize plan string to ListingTier
 */
export function normalizeListingTier(
  plan: string | null,
  comped?: boolean | null
): ListingTier {
  if (comped) return "pro"; // Comped listings treated as Pro

  const p = (plan || "free").toLowerCase();
  if (p.includes("pro") || p.includes("premium")) return "pro";
  if (p.includes("standard")) return "standard";
  return "free";
}

/**
 * Get contact/interaction capabilities based on listing tier.
 *
 * @param listingTier - The tier the listing is on (free/standard/pro)
 * @param viewer - Optional viewer context for admin overrides
 */
export function getListingCapabilities(
  listingTier: ListingTier,
  viewer: ViewerContext = {}
): ListingCapabilities {
  const isPro = listingTier === "pro" || listingTier === "premium";
  const isStandard = listingTier === "standard" || isPro;

  // Admins can see full interactivity for QA
  if (viewer.isAdmin) {
    return {
      canClickWebsite: true,
      canClickSocials: true,
      canClickEmail: true,
      canClickPhone: true,
      showLeadForm: true,
      obfuscateEmail: false,
      obfuscatePhone: false,
      cta: "CONTACT_MODAL",
    };
  }

  return {
    canClickWebsite: isStandard,
    canClickSocials: isStandard,
    canClickEmail: isPro,
    canClickPhone: isPro,
    showLeadForm: isPro && (viewer.isLoggedIn ?? true), // decide if login required
    obfuscateEmail: !isPro, // [at]/[dot] for free+standard
    obfuscatePhone: false, // phones are already less scrapable
    cta: isPro ? "CONTACT_MODAL" : isStandard ? "VISIT_WEBSITE" : "VIEW_PROFILE",
  };
}

/**
 * Obfuscate email for display (reduces casual harvesting).
 * Note: This is NOT anti-scraping security - just friction.
 *
 * @example "john@example.com" -> "john [at] example [dot] com"
 */
export function obfuscateEmail(email: string): string {
  return email.replace("@", " [at] ").replace(/\./g, " [dot] ");
}

/**
 * Format phone for display (no obfuscation, just consistent formatting)
 */
export function formatPhoneDisplay(phone: string): string {
  // Just return as-is - phones are already harder to scrape than emails
  return phone;
}
