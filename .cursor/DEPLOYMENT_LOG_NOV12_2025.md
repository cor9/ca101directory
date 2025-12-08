Date: 2025-11-12

Summary of changes deployed to main:
- Vendor gallery captions: modal-only captions; edit forms (vendor/admin/submit) now support `{ url, caption }` objects, backward-compatible with legacy `string[]`.
- Listing header redesign:
  - Quick Facts (contact, categories, age ranges) moved into header with clean text layout and small icons.
  - Contact icons use border blue; text remains white on navy.
  - Categories rendered as text-only chips with mustard `#c7a163`; duplicates deduped.
  - Ages rendered as light grey chips with bold black text; formats (online/hybrid) summarized as “Virtual services available”.
  - “Visit Website” button restyled as distinct primary CTA.
  - 101 Approved displayed as a larger icon next to the title.
- Social “Connect With Us” card:
- Category counts fix:
  - Category index now resolves UUID category IDs to names before counting.
  - Prevents undercounting when listings store category UUIDs instead of names.
  - Additionally, counts are verified by calling the same filtered `getPublicListings({ category })` used by the detail page to guarantee parity.
  - Card background switched to Bauhaus orange/rust variant.
  - Larger header text.
  - Social chips outlined with white borders for contrast (YouTube especially).

Files touched (high-level):
- `src/components/shared/image-modal.tsx` (captions, scrollable)
- `src/components/listing/gallery.tsx` (parse captions)
- `src/components/vendor/vendor-edit-form.tsx` (captions)
- `src/components/admin/admin-edit-form.tsx` (captions)
- `src/components/submit/edit-form.tsx` (captions)
- `src/lib/schemas.ts`, `src/actions/submit-supabase.ts` (schema/type updates)
- `src/app/(website)/(public)/listing/[slug]/page.tsx` (header layout, dedupe)
- `src/components/ui/social-media-icons.tsx` (card styling)
- `src/styles/globals.css` (badge/chip/CTA/card variants)

Notes:
- Tier restrictions preserved; no changes to gating logic.
- All updates lint-clean.

