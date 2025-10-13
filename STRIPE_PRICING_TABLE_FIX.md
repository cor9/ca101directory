# Stripe Pricing Table Fix - Remove Free Option

## Issue
The Stripe pricing table on `/pricing` page is showing a "Free Vendor Listing" option that should not be there.

## Current Pricing Table ID
```
pricing-table-id="prctbl_1SDbLwBqTvwy9ZuSXKTXVb7E"
```

## What's Showing (WRONG):
- ❌ Free Vendor Listing - $0
- ✅ Standard Plan - $25/month
- ✅ Pro Plan - $50/month

## What SHOULD Show:
- ✅ Standard Plan - $25/month
- ✅ Pro Plan - $50/month

## How to Fix in Stripe Dashboard

### Step 1: Go to Stripe Dashboard
1. Log in to https://dashboard.stripe.com
2. Navigate to **Products** → **Pricing Tables**
3. Find pricing table: `prctbl_1SDbLwBqTvwy9ZuSXKTXVb7E`

### Step 2: Edit the Pricing Table
1. Click on the pricing table to edit
2. Find the "Free Vendor Listing" product
3. **Remove it** from the pricing table
4. Save changes

### Step 3: Verify
1. The pricing table should now only show:
   - Standard ($25/month or $250/year)
   - Pro ($50/month or $500/year)
2. The Free option should NOT appear

## Alternative Solution

If you can't edit the existing pricing table, create a NEW pricing table with only Standard and Pro, then update the code:

```typescript
// In src/app/(website)/(public)/pricing/page.tsx
<stripe-pricing-table
  pricing-table-id="NEW_PRICING_TABLE_ID_HERE"  // Replace with new ID
  publishable-key="pk_live_51RCXSKBqTvwy9ZuSvBCc8cWJuw8xYvOZs0XoNM6zqecXU9mVQnDWzOvPpOCF7XFTrqB84lB7hti3Jm8baXqZbhcV00DMDRweve"
/>
```

## Why Free Should NOT Be in Stripe

1. **Free listings don't need payment processing** - no Stripe involved
2. **You create Free listings** via bulk import/admin tools
3. **Vendors claim Free listings** - they don't "buy" them
4. **Confusing UX** - "Pay $0" doesn't make sense
5. **Wrong flow** - Free should go to `/submit`, not through Stripe

## Correct Free Plan Flow

Free plan is handled separately:
- Custom card on pricing page
- "Start Free Listing" button
- Routes directly to `/submit` form
- No Stripe checkout involved
- Creates listing with plan = "Free"

---

**Action Required:** Edit Stripe pricing table `prctbl_1SDbLwBqTvwy9ZuSXKTXVb7E` to remove the Free option.

