# GUARDRAILS.md

## ✅ Allowed

- Pull vendor data from Airtable using `airtable.ts`
- Use Airtable as the ONLY CMS — no Sanity, no Supabase
- Use `slug` param to route to listing detail pages
- Only update listings with `Status: Approved`
- Pull pricing plans from `Plans` table and format as cards
- Redirect users to Stripe Checkout via links stored in Airtable
- Use Child Actor 101 branding: fonts, colors, tone

## 🚫 Forbidden

- Do NOT generate or suggest static `.json` files for content
- Do NOT add login functionality (auth not enabled)
- Do NOT use hardcoded Stripe keys or price IDs
- Do NOT use database models or Prisma (no SQL layer)
- Do NOT auto-approve vendor submissions
- Do NOT add “review” or “rating” features without a new context decision

## 🧠 Brand & UX Notes

- Design is **minimal**, **mobile-first**, and **parent-friendly**
- Use language that speaks to **non-tech-savvy parents**
- Icons and categories should be **friendly and colorful**, not corporate
- Listing cards should include logo, name, tagline (if applicable), and CTA
- No login needed: one-page checkout → intake form → done

## 🧪 Future-Proofing

- Stripe Webhook integration is TBD
- Supabase auth may be added in future
- Dashboard UI may replace Airtable once user auth is built