## Context Decisions

### Listing type model (SERVICE_VENDOR / INDUSTRY_PRO / REGULATED_PRO)
- **Decision**: Introduce `listing_type` to separate reps + regulated roles from normal service vendors.
- **Why**: Prevents misleading "paid tier / featured" signals for agents/managers and allows type-aware UX (contact, pricing, badges).
- **Implementation**:
  - Supabase migration file: `supabase/migrations/add_listing_type.sql`
  - Shared helper: `src/lib/listings/listingType.ts`
  - UI rules:
    - `INDUSTRY_PRO`: hide Pro/Featured badges, no pricing section, no upgrade prompts; contact is not paywalled.
    - `SERVICE_VENDOR` / `REGULATED_PRO`: existing tier gating remains.

### Featured Listings Cache Invalidation
- **Decision**: Added `revalidateTag("featured-listings")` to listing update actions.
- **Why**: Featured listings use a 24-hour cached query (`getFeaturedListings()`). When images were updated, they appeared in the directory immediately but not in Featured sections because the cache wasn't invalidated.
- **Implementation**:
  - Added `revalidateTag("featured-listings")` to `updateListing()` in `src/actions/listings.ts`
  - Added `revalidateTag("featured-listings")` to `adminUpdateListing()` in `src/actions/admin-edit.ts`
  - Cache tag matches the tag used in `getFeaturedListings()`: `["featured-listings"]`
- **Impact**: Image changes (and other listing updates) now appear immediately in Featured sections on homepage and directory page.


