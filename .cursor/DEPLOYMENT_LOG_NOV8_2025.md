Date: 2025-11-08

Summary:
- Fix: Show two rows of featured listings on home; add featured section to directory
- Fix: Headshot Photographers page counts and duplicate listings
- Fix: Category synonyms (Headshot Photographers/Photographer, Self Tape, Reel Editors) for accurate totals
- Fix: Conservative dedup across website/email/owner+name with safe fallback; special-case headshots by listing_name

Changes:
- `src/components/home/home-featured-listings.tsx`: Increase featured slice to 6
- `src/app/(website)/(public)/directory/page.tsx`: Render featured section
- `src/data/item-service.ts`: Merge category synonyms; dedup headshots by `listing_name`
- `src/data/listings.ts`: Robust dedup key + “best” listing scoring (featured/plan/comped/claimed)
- `.cursor/context_Decisions.md`: Document decisions

Notes:
- Directory total intentionally shows deduped Live/active catalog, not raw DB count.
- Headshot photographers now de-duped by name within category merge to remove doubles safely.

Status:
- Pushed to main; Vercel production deployment triggered and monitored.


