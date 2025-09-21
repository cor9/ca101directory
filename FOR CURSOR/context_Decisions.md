# CONTEXT_DECISIONS.md

## Project Overview
Child Actor 101 Directory is a public resource for vetted industry vendors (photographers, coaches, editors, etc.) aimed at parents of young actors. The directory uses Airtable as the backend CMS and Stripe for monetization.

---

## 🧠 Source of Truth
**CMS**: Airtable (no Sanity or external database)
- Listings, Categories, and Plans come from Airtable tables
- Admin edits happen directly in Airtable, not via CMS UI

**Frontend**: React (Next.js)
- MkDirs open-source template forked and heavily customized
- Hosted on Vercel (`directory.childactor101.com`)

---

## 🧾 Data Sources

| Table       | Purpose                          |
|-------------|----------------------------------|
| Listings    | All vendor submissions + statuses|
| Categories  | Linked to Listings               |
| Plans       | Maps to Stripe Plans             |
| Submissions | Airtable intake form responses   |

---

## 💳 Stripe Integration

- Stripe Checkout is used (no custom billing portal)
- After checkout → vendor is redirected to Airtable form
- Form responses create "Pending" listings

**Plan SKUs (mapped manually):**
- Basic Listing – $12/mo
- Pro Listing – $29/mo
- Premium Listing – $59/mo
- 101 Approved Add-On – $35 one-time

*NOTE: No webhooks yet. Admin manually approves listings.*

---

## 🔒 Auth Decisions

- No login required for vendors
- Admin moderation is via Airtable only (no dashboard yet)
- Future: possible Supabase auth for vendors

---

## 🌍 Deployment

- GitHub repo connected to Vercel
- `.env` file includes:
  - `NEXT_PUBLIC_APP_URL`
  - `AIRTABLE_API_KEY`
  - `AIRTABLE_BASE_ID`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY` *(if webhook integration is added)*