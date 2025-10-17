# 🚀 Child Actor 101 Directory - Vercel Deployment Guide

## ✅ **Code Successfully Pushed to GitHub!**

Your Child Actor 101 Directory is now available at:
**https://github.com/cor9/ca101directory**

---

## 🌐 **Step 1: Create Vercel Project**

1. **Go to [Vercel](https://vercel.com)** and log in
2. **Click "Add New Project"**
3. **Import from GitHub:**
   - Select `cor9/ca101directory`
   - Framework Preset: **Next.js** (auto-detected)
   - **Build Command:** `pnpm build` (MkDirs uses pnpm)
   - **Install Command:** `pnpm install`
   - Click **"Import"**

---

## 🛠️ **Step 2: Set Environment Variables**

In Vercel Project Settings → Environment Variables, add:

### **Airtable Configuration**
```
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
```

### **Stripe Configuration**
```
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

### **Stripe Price IDs**
```
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=price_basic_here
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_pro_here
NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM=price_premium_here
NEXT_PUBLIC_STRIPE_PRICE_ID_ADDON=price_addon_here
```

### **Site Configuration**
```
NEXT_PUBLIC_APP_URL=https://directory.childactor101.com
```

### **Auth Configuration (from MkDirs)**
```
AUTH_SECRET=your_auth_secret_here
AUTH_GITHUB_ID=your_github_id_here
AUTH_GITHUB_SECRET=your_github_secret_here
AUTH_GOOGLE_ID=your_google_id_here
AUTH_GOOGLE_SECRET=your_google_secret_here
DATABASE_URL=your_database_url_here
RESEND_API_KEY=your_resend_api_key_here
```

---

## 🧱 **Step 3: Project Structure Confirmed**

✅ **Key Files Ready:**
- `/src/lib/airtable.ts` - Airtable API integration
- `/src/data/airtable-item.ts` - Custom data fetcher from Airtable
- `/src/app/(website)/(public)/listing/[slug]/page.tsx` - Public directory item page
- `/src/config/price.ts` - Stripe pricing details ($29, $49, $99, $25)
- `/src/config/site.ts` - Child Actor 101 branding

---

## 🔄 **Step 4: Stripe → Airtable Flow**

**Current Flow:**
1. User clicks Stripe Checkout link from Pricing Page
2. Stripe redirects to success page
3. Success page links to Airtable vendor intake form
4. Form submission → new "Pending" listing in Airtable
5. Admin sets Status = "Approved" in Airtable
6. Approved listings appear live on directory

---

## 🚀 **Step 5: Deploy**

1. **In Vercel dashboard:**
   - Go to your imported project
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete

2. **Your site will be live at:**
   - `https://ca101directory.vercel.app` (default)
   - Or your custom domain

---

## 🌍 **Step 6: Custom Domain Setup**

1. **In Vercel → Domain Settings:**
   - Add domain: `directory.childactor101.com`
   - Follow DNS instructions

2. **DNS Configuration:**
   - Add CNAME record: `cname.vercel-dns.com`
   - Or use A records as instructed by Vercel

---

## 🧪 **Step 7: Test Your Deployment**

**Test These Features:**
- ✅ Home page loads with Child Actor 101 branding
- ✅ Directory/search page shows listings
- ✅ Individual listing pages work
- ✅ Pricing page shows correct plans
- ✅ Stripe checkout flows work
- ✅ 101 Approved badges display correctly

---

## 🛎️ **Future Enhancements (Optional)**

- **Stripe Webhook** - Auto-update Airtable on payment
- **Admin Dashboard** - Approve listings in-app
- **Vendor Login** - Preview/edit listings
- **Ratings & Reviews** - User feedback system
- **Rich SEO** - Dynamic metadata per listing

---

## 🎉 **You're Ready to Deploy!**

Your Child Actor 101 Directory is fully prepared for Vercel deployment with:
- ✅ MkDirs template customized
- ✅ Airtable CMS integration
- ✅ Stripe payment plans
- ✅ Child Actor 101 branding
- ✅ 101 Approved badge system
- ✅ Clean, secure codebase

**Next:** Follow the Vercel deployment steps above! 🚀
