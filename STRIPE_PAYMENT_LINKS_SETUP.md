# Stripe Payment Links Setup Required

## Problem
The purchase links are showing "You've either completed your payment or this checkout session has timed out" because:
1. Stripe checkout sessions are single-use only
2. The `stripePriceId` values in `src/config/price.ts` are placeholder strings, not real Stripe IDs
3. The `StripeDirectButton` component tries to open these placeholders as URLs

## Solution
You need to create **Stripe Payment Links** (reusable) for each plan, NOT checkout sessions (single-use).

### Steps to Fix:

#### 1. Create Payment Links in Stripe Dashboard

Go to Stripe Dashboard → Products → Each Product → Create Payment Link

For each plan, create a payment link:

**Basic Monthly ($25/month)**
- Product: Basic Plan
- Price: $25/month (recurring)
- After creating, copy the Payment Link URL (looks like: `https://buy.stripe.com/xxxxx`)

**Pro Monthly ($50/month)**
- Product: Pro Plan  
- Price: $50/month (recurring)
- Copy the Payment Link URL

**Premium Monthly ($90/month)**
- Product: Premium Plan
- Price: $90/month (recurring)
- Copy the Payment Link URL

**Basic Annual ($250/year)**
- Product: Basic Plan
- Price: $250/year (recurring)
- Copy the Payment Link URL

**Pro Annual ($500/year)**
- Product: Pro Plan
- Price: $500/year (recurring)
- Copy the Payment Link URL

**Premium Annual ($900/year)**
- Product: Premium Plan
- Price: $900/year (recurring)
- Copy the Payment Link URL

#### 2. Update Configuration

Add these Payment Link URLs to `.env.local` and Vercel:

```bash
# Stripe Payment Links (Monthly)
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BASIC_MONTHLY=https://buy.stripe.com/xxxxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO_MONTHLY=https://buy.stripe.com/xxxxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PREMIUM_MONTHLY=https://buy.stripe.com/xxxxx

# Stripe Payment Links (Annual)
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_BASIC_ANNUAL=https://buy.stripe.com/xxxxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO_ANNUAL=https://buy.stripe.com/xxxxx
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PREMIUM_ANNUAL=https://buy.stripe.com/xxxxx
```

#### 3. Configure Payment Link Settings

For each Payment Link in Stripe, make sure to:
- ✅ **Enable "Collect customer information"** (name, email)
- ✅ **Enable "Collect billing address"**
- ✅ **Set Success URL**: `https://directory.childactor101.com/payment-success`
- ✅ **Set Cancel URL**: `https://directory.childactor101.com/pricing?canceled=1`
- ✅ **Enable "Allow promotion codes"** (optional but recommended)

#### 4. Important: Add Metadata to Each Payment Link

In each Payment Link settings, add these metadata fields:
- `source`: `website_pricing`
- `plan`: `basic` (or `pro`, `premium`)
- `billing_cycle`: `monthly` (or `annual`)

This metadata will be passed to your webhook so you can identify which plan was purchased.

## Alternative: Use Stripe Pricing Tables (Recommended)

The site is already using Stripe Pricing Tables in some places. This is actually the BETTER solution:

1. Go to Stripe Dashboard → Settings → Billing → Customer Portal
2. Create a Pricing Table with all your products
3. Copy the Pricing Table ID and Publishable Key
4. The existing code already uses this approach on `/plan-selection` and homepage

## Current Status

The site currently uses **both** approaches:
- ✅ Stripe Pricing Tables work fine (on homepage, plan-selection page)
- ❌ Individual "Choose Plan" buttons don't work (using placeholder IDs)

### Quick Fix Option

Until you set up Payment Links, you can:
1. Remove the individual plan buttons
2. Always redirect to the Stripe Pricing Table page
3. Let users choose their plan from the embedded Stripe widget

This would work immediately without any Stripe configuration changes.

