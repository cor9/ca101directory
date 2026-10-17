import type { UpdateListingSchema } from "@/lib/validations/listings";
import type { z } from "zod";

/**
 * Fields a vendor (non-admin owner) may change through `updateListing`.
 *
 * Everything in `UpdateListingSchema` that is NOT in this list is
 * privileged: `status` / `is_active` (moderation/publish state — vendors
 * use the dedicated `publish`/`unpublish` actions instead), `is_claimed`
 * (ownership, set only by the claim flow), and `plan` / `featured` /
 * `is_approved_101` (billing-derived and admin-curated trust signals).
 *
 * Extracted from `actions/listings.ts` (a "use server" module, which can
 * only export async server actions) so this allowlist can be unit tested
 * directly — see scripts/test-vendor-authorization.ts.
 */
export const VENDOR_EDITABLE_LISTING_FIELDS = [
  "listing_name",
  "website",
  "email",
  "phone",
  "what_you_offer",
  "city",
  "state",
  "zip",
  "facebook_url",
  "instagram_url",
  "custom_link_url",
  "custom_link_name",
  "video_url",
  "why_is_it_unique",
  "format",
  "extras_notes",
  "profile_image",
  "gallery",
  "categories",
  "age_range",
  "age_tags",
  "services_offered",
  "specialties",
  "region",
  "logo_url",
  "secondary_locations",
  "ca_permit_required",
  "is_bonded",
  "bond_number",
] as const satisfies readonly (keyof z.infer<typeof UpdateListingSchema>)[];

/**
 * A non-admin owner's update payload is filtered through this before it
 * ever reaches the database — see `pickVendorEditableFields` below — so
 * no client payload can grant Pro, Featured, Approved, or change
 * publish/ownership state. Admins bypass this allowlist entirely and may
 * set any field the schema validates.
 */
export function pickVendorEditableFields<T extends Record<string, unknown>>(
  payload: T,
): Partial<T> {
  const picked: Partial<T> = {};
  for (const field of VENDOR_EDITABLE_LISTING_FIELDS) {
    if (field in payload) {
      picked[field as keyof T] = payload[field as keyof T];
    }
  }
  return picked;
}
