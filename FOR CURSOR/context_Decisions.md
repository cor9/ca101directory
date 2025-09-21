# CONTEXT_DECISIONS.md

## Project Overview
Child Actor 101 Directory is a curated directory of vetted coaches, photographers, editors, and industry professionals specializing in youth acting. Built on the MkDirs template with Airtable CMS and Stripe payment integration.

---

## 🧠 Source of Truth
**CMS**: Airtable (replaced Sanity CMS)
- Listings, Categories, and Plans come from Airtable tables
- Admin edits happen directly in Airtable interface
- Data layer implemented in `src/data/airtable-item.ts`

**Frontend**: Next.js 14 (App Router)
- MkDirs template forked and customized for Child Actor 101
- Hosted on Vercel (ready for deployment)
- TypeScript with Tailwind CSS styling

---

## 🧾 Data Sources

| Table       | Purpose                          | Status |
|-------------|----------------------------------|---------|
| Listings    | All vendor submissions + statuses| ✅ Implemented |
| Categories  | Linked to Listings               | ✅ Implemented |
| Plans       | Maps to Stripe Plans             | ✅ Configured |
| Submissions | Airtable intake form responses   | 🔄 Pending |

---

## 💳 Stripe Integration

- Stripe Checkout configured for vendor payment plans
- Payment plans defined in `src/config/price.ts`
- Webhook handler placeholder in `src/app/api/webhook/route.ts`

**Plan Structure:**
- Basic Plan: $29/month
- Pro Plan: $49/month  
- Premium Plan: $99/month
- 101 Badge Add-on: $25 one-time

*NOTE: Webhook integration pending - currently using placeholder*

---

## 🔒 Auth Decisions

- NextAuth.js configured but simplified (no Sanity dependencies)
- Authentication callbacks disabled for now
- No login required for vendors currently
- Admin moderation via Airtable interface
- Future: Full authentication system for vendors

---

## 🌍 Deployment

- GitHub repo: `https://github.com/cor9/ca101directory`
- Ready for Vercel deployment
- Environment variables needed:
  - `AIRTABLE_API_KEY`
  - `AIRTABLE_BASE_ID`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `RESEND_API_KEY`

---

## 🎨 Branding

- **Primary Color**: #FF6B35 (Orange)
- **Secondary Color**: #004E89 (Blue)
- **Accent Color**: #F7931E (Gold)
- **Font**: Inter (Google Fonts)
- **Design**: Minimal, mobile-first, parent-friendly

---

## 📁 Key Files

- `src/data/airtable-item.ts` - Airtable data layer
- `src/lib/airtable.ts` - Airtable API client
- `src/lib/stripe.ts` - Stripe integration
- `src/config/price.ts` - Payment plan configuration
- `src/config/site.ts` - Site metadata and branding
- `AIRTABLE_SETUP.md` - Database schema guide
- `VERCEL_DEPLOYMENT.md` - Deployment checklist

---

## 🚀 Current Status

**✅ COMPLETED:**
- Core directory functionality (homepage, search, categories)
- Airtable integration and data layer
- Child Actor 101 branding and content
- Stripe payment plan configuration
- Responsive design and SEO optimization

**🔄 IN PROGRESS:**
- Removing remaining Sanity dependencies
- Secondary features (blog functionality)

**📋 NEXT STEPS:**
- Deploy to Vercel
- Set up Airtable base with proper schema
- Configure Stripe webhooks
- Add initial content and listings