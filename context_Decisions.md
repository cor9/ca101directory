## Context Decisions

### Listing type model (SERVICE_VENDOR / INDUSTRY_PRO / REGULATED_PRO)
- **Decision**: Introduce `listing_type` to separate reps + regulated roles from normal service vendors.
- **Why**: Prevents misleading “paid tier / featured” signals for agents/managers and allows type-aware UX (contact, pricing, badges).
- **Implementation**:
  - Supabase migration file: `supabase/migrations/add_listing_type.sql`
  - Shared helper: `src/lib/listings/listingType.ts`
  - UI rules:
    - `INDUSTRY_PRO`: hide Pro/Featured badges, no pricing section, no upgrade prompts; contact is not paywalled.
    - `SERVICE_VENDOR` / `REGULATED_PRO`: existing tier gating remains.


