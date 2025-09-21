# Child Actor 101 Directory - Setup Guide

## 🎉 What's Been Completed

✅ **MkDirs Template Setup**
- Cloned and installed MkDirs template
- Development server running at `http://localhost:3000`

✅ **Airtable Integration**
- Created Airtable integration (`/src/lib/airtable.ts`)
- Replaced Sanity with Airtable data layer (`/src/data/airtable-item.ts`)
- Updated search page to use Airtable data
- Created new listing detail page (`/listing/[slug]`)

✅ **Child Actor 101 Branding**
- Updated site configuration (`/src/config/site.ts`)
- Updated hero configuration (`/src/config/hero.ts`)
- Updated marketing configuration (`/src/config/marketing.ts`)
- Updated FAQ configuration (`/src/config/faq.ts`)
- Updated pricing configuration (`/src/config/price.ts`)

✅ **Stripe Payment Plans**
- Basic: $29/month
- Pro: $49/month
- Premium: $99/month
- 101 Badge Add-on: $25 one-time

## 🚀 Next Steps to Complete Setup

### 1. Create Airtable Base

Create a new Airtable base with these tables:

#### Listings Table
| Field Name | Type | Options/Notes |
|------------|------|---------------|
| Business Name | Single Line Text | Required |
| Email | Email | Required |
| Phone | Phone | Required |
| Website | URL | Optional |
| Instagram | URL | Optional |
| Services Offered | Long Text | Optional |
| Description | Long Text | Required |
| Category | Linked to Categories | Multi-select |
| Location | Single Line Text | Required |
| Virtual | Checkbox | Default: false |
| Age Range | Multi-select | Options: "5-8", "9-12", "13-17", "18+" |
| Plan | Single Select | Options: "Basic", "Pro", "Premium", "Add-On" |
| Featured | Checkbox | Default: false |
| 101 Approved | Checkbox | Default: false |
| Status | Single Select | Options: "Pending", "Approved", "Rejected" |
| Logo | Attachment | Single file |
| Gallery | Attachment | Multiple files |
| Stripe Checkout ID | Single Line Text | For tracking payments |
| Date Submitted | Date | Auto-filled |
| Date Approved | Date | Manual entry |

#### Categories Table
| Field Name | Type | Options/Notes |
|------------|------|---------------|
| Category Name | Single Line Text | Required |
| Description | Long Text | Optional |
| Icon | Attachment | Optional |

### 2. Set Up Environment Variables

Create `.env.local` file with:

```env
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Stripe Price IDs for different plans
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=price_basic_here
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_pro_here
NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM=price_premium_here
NEXT_PUBLIC_STRIPE_PRICE_ID_ADDON=price_addon_here

# Site Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth Configuration (keeping from MkDirs)
AUTH_SECRET=your_auth_secret_here
AUTH_GITHUB_ID=your_github_id_here
AUTH_GITHUB_SECRET=your_github_secret_here
AUTH_GOOGLE_ID=your_google_id_here
AUTH_GOOGLE_SECRET=your_google_secret_here

# Database (keeping from MkDirs)
DATABASE_URL=your_database_url_here

# Email (keeping from MkDirs)
RESEND_API_KEY=your_resend_api_key_here
```

### 3. Deploy to Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy
5. Set up custom domain: `directory.childactor101.com`

### 4. Test the Application

1. Add sample data to Airtable
2. Test the search/directory functionality
3. Test individual listing pages
4. Verify Stripe integration

## 📁 Key Files Modified

- `/src/lib/airtable.ts` - Airtable integration
- `/src/data/airtable-item.ts` - Data layer for Airtable
- `/src/config/site.ts` - Site configuration
- `/src/config/hero.ts` - Hero section
- `/src/config/marketing.ts` - Navigation
- `/src/config/faq.ts` - FAQ content
- `/src/config/price.ts` - Pricing plans
- `/src/app/(website)/(public)/search/page.tsx` - Directory page
- `/src/app/(website)/(public)/listing/[slug]/page.tsx` - Listing detail page

## 🎨 Branding Applied

- **Site Name**: Child Actor 101 Directory
- **Tagline**: Find Trusted Acting Professionals for Your Child
- **Colors**: Ready for chalkboard green, pastel blue, soft gold theme
- **Content**: All text updated for Child Actor 101
- **Navigation**: Streamlined for directory functionality

## 🔧 Technical Stack

- **Frontend**: Next.js 14, Tailwind CSS
- **CMS**: Airtable (replacing Sanity)
- **Payments**: Stripe Checkout
- **Deployment**: Vercel
- **Template**: MkDirs (customized)

The application is now ready for Airtable setup and deployment!

