# Admin Revalidation Fix - November 10, 2025

## Summary
- Fixed admin edit saves not reflecting immediately on the Admin Listings page and homepage featured section.
- Root cause: The server action used by Admin Edit (`src/actions/listings.ts:updateListing`) only revalidated `/dashboard/admin`, not `/dashboard/admin/listings`, `/`, or the listing detail route.

## Change
- After successful update, now revalidates:
  - `/dashboard/admin`
  - `/dashboard/admin/listings`
  - `/` (homepage - Featured listings)
  - `/listing/[slug]` or `/listing/[id]` (detail page)

## Files
- Updated: `src/actions/listings.ts`

## Impact
- Admin edits (including `featured`, `status`, `is_active`) now appear instantly on:
  - Admin Listings management table
  - Homepage Featured Professionals section
  - Listing detail page

## Notes
- Featured section only renders public listings (status in Live/Published variants) and with `is_active = true` or `null`. Ensure those fields are set for featured vendors (e.g., Real Actors Lab).


