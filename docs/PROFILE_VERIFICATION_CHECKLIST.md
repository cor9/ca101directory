# Profile Verification Checklist

Use this checklist before setting `profile_verified = true` on a listing.

---

## ✅ Verification Criteria

| Check | What to Look For |
|-------|------------------|
| **Website or Social Link** | At least one valid link (website, Instagram, LinkedIn, etc.) that shows real business activity |
| **Business Email** | Email matches domain OR there's a reasonable explanation (e.g., Gmail for sole proprietor) |
| **Bio Not Spam** | Description reads like a real professional, not keyword stuffing or placeholder text |
| **Category/Location Sane** | Category matches their actual service; city/state makes sense for their coverage area |

---

## 🚫 What This Is NOT

- **Not a background check** — We don't verify criminal history, permits, or bonding
- **Not legal compliance** — We don't verify CA studio permits, work permits, or child labor laws
- **Not an endorsement** — Verification means "looks legit" not "we recommend them"

---

## How to Verify (Supabase)

1. Open listing in Supabase table editor
2. Review against checklist above
3. If passes:
   - Set `profile_verified` = `true`
   - Set `profile_verified_at` = current timestamp
4. If fails: Leave `profile_verified` = `false`, optionally add note to internal tracking

---

## Tooltip Copy (for reference)

> "Profile Verified means the provider has claimed this listing and it's been reviewed by Child Actor 101 for basic legitimacy and completeness. It is not a criminal background check."

