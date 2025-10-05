# Directory Lite: Vendor-Only Mode Deployment Plan

## 🎯 Goal

Launch a simplified production-ready version of the Child Actor 101 Directory where:

- Parents/guests can browse freely (no login required).
- Only vendors can authenticate, claim, and manage listings.
- Reviews, favorites, and ratings are disabled.
- Future features (e.g. parent interactivity) are easily re-enabled.

---

## ✅ Summary of Key Changes

| Feature                     | Status         |
|-----------------------------|----------------|
| Public Directory View       | ✅ Enabled     |
| Vendor Authentication       | ✅ Enabled     |
| Listing Claim/Edit          | ✅ Enabled     |
| Parent Authentication       | ❌ Disabled    |
| Review System               | ❌ Disabled    |
| Favorites/Bookmarks         | ❌ Disabled    |
| Admin Moderation Tools      | ✅ Enabled     |

---

## 🔐 Authentication Rules

- Allow authentication/signup for `vendor` role only.
- Block all attempts to register/login as `parent` or `guest`.
- Redirect any unauthorized dashboard access to login.

```ts
// auth/roles.ts
export const ENABLED_ROLES = ['vendor', 'admin']
```

---

## 🧱 UI/UX Adjustments

### Homepage `/`

- Show listing grid (publicly visible).
- Enable filters: category, region, badges.
- Remove “Save”, “Bookmark”, or “Write a Review” buttons.

### `/listing/[slug]`

- Display vendor details: name, city, category, badges.
- CTA: “Visit Website” or “Contact Vendor”
- If vendor is logged in and owns listing → show “Edit Listing”

---

## ✏️ Vendor Dashboard `/dashboard/vendor`

- Allow vendor to:
  - Submit or edit 1 listing
  - Upload logo / description
  - View listing status
  - Upgrade plan (optional via Stripe)

---

## ❌ Removed/Disabled Features

- Reviews: Removed `reviews` table, review form, and display logic.
- Favorites: Removed `favorites` logic and UI.
- Parent Dashboards: `/dashboard/parent` route is blocked.

---

## 🛡️ Admin Controls

- `/dashboard/admin` (or protected route):
  - Approve/reject new vendor submissions
  - Add “101 Approved” badge
  - View plan tier, listing analytics (future)

---

## 🗂️ Database Schema Usage

**Keep:** `users`, `listings`, `plans`, `badges`  
**Skip:** `reviews`, `favorites`, `parent_profiles`

---

## 💬 Suggested UI Copy

- “Parents can freely view listings—no login needed.”
- “All vendors are reviewed and verified before publishing.”
- “Want to appear in our directory? Add your listing today.”

---

## 🔜 Future Expansion Plan

When ready to reintroduce parent features:

- Enable `parent` role in `ENABLED_ROLES`
- Rewire `favorites`, `reviews`, and `/dashboard/parent`
- Add review moderation system for quality control
