# Current Vendor Flow Analysis

**Date:** October 11, 2025  
**Purpose:** Complete mapping of vendor journey for optimization

---

## 📊 OVERVIEW: 3 VENDOR ENTRY PATHS

```
PATH A: New Vendor Submission (Free)
PATH B: New Vendor Submission (Paid)
PATH C: Existing Listing Claim (Unclaimed listings in directory)
```

---

## 🛤️ PATH A: NEW VENDOR SUBMISSION (FREE)

### Entry Points:
1. Homepage: "List your business here →" link
2. `/list-your-business` page
3. `/submit` page (left side)
4. Navbar: "Submit" link

### Flow Diagram:
```
1. Vendor visits /submit
   ↓
2. Sees 2 options: "Free Listing" vs "Paid Listing"
   ↓
3. Fills out FREE form (left side):
   - Business name
   - What you offer
   - Who it's for
   - Categories (checkboxes)
   - Contact info (email, phone)
   - Location (city, state, region)
   - Format (online/in-person/hybrid)
   - Website
   - Social media links
   - Profile image (1 only)
   - NO gallery images
   ↓
4. Clicks "Submit Free Listing"
   ↓
5. ❓ Auth Check: Logged in?
   ├─ NO → Can submit anyway (no auth required)
   └─ YES → Listing linked to user ID
   ↓
6. Listing created with:
   - status: "Pending"
   - plan: "Free"
   - owner_id: user ID (if logged in) OR NULL
   - is_claimed: false (if not logged in)
   ↓
7. Redirects to /submit/success
   ↓
8. ⏰ WAITS for Admin Approval
   ↓
9. Admin reviews in /dashboard/admin/listings
   ↓
10. Admin changes status: "Pending" → "Live"
    ↓
11. ✅ Listing appears on public directory
    ↓
12. Vendor gets notification email (if provided email)
```

### Current Issues with Path A:
- ⚠️ If vendor doesn't register, they can't claim their listing later
- ⚠️ No automatic link between submission and user account
- ⚠️ Vendor might not know they need to claim it
- ⚠️ Free listings don't get owner_id unless logged in during submission

---

## 🛤️ PATH B: NEW VENDOR SUBMISSION (PAID)

### Flow Diagram:
```
1. Vendor visits /submit
   ↓
2. Fills out PAID form (right side):
   - Same fields as Free
   - Plus: Select plan (Standard/Pro/Premium)
   - Plus: Gallery images (up to 4 for Pro)
   ↓
3. Clicks "Submit & Choose Plan"
   ↓
4. ❓ Auth Check: Logged in?
   ├─ NO → Redirected to /auth/register
   └─ YES → Continue
   ↓
5. Listing created with:
   - status: "Pending"
   - plan: Selected plan
   - owner_id: user ID
   - is_claimed: true (because logged in)
   ↓
6. Redirects to /plan-selection?listingId=XXX
   ↓
7. Stripe Checkout opens
   ↓
8. Payment processed
   ↓
9. Webhook updates:
   - subscription_plan on profile
   - billing_cycle on profile
   - stripe_customer_id on profile
   ↓
10. ⏰ WAITS for Admin Approval
    ↓
11. Admin reviews and approves → "Live"
    ↓
12. ✅ Listing appears on directory (with featured placement)
```

### Current Issues with Path B:
- ⚠️ Requires login BEFORE filling out form (might lose users)
- ⚠️ Still requires admin approval even after payment
- ⚠️ No immediate gratification after paying

---

## 🛤️ PATH C: CLAIM EXISTING LISTING (TODAY'S FIX)

### Entry Points:
1. Vendor finds their listing on directory
2. Clicks "Claim This Listing" button
3. OR clicks "Claim Listing" in listing dropdown menu

### Flow Diagram (NEW - As of Oct 11):
```
1. Vendor finds their listing
   ↓
2. Clicks "Claim This Listing"
   ↓
3. ❓ Auth Check: Logged in?
   ├─ NO → Redirected to /auth/register
   └─ YES → Continue
   ↓
4. Shows claim form:
   - Message/verification info
   - "Why are you claiming this?"
   ↓
5. Clicks "Submit Claim"
   ↓
6. ✅ INSTANT AUTO-APPROVAL (NEW!)
   - Listing ownership transferred immediately
   - owner_id: user ID
   - is_claimed: true
   - claimed_by_email: user email
   - date_claimed: now()
   ↓
7. Success message:
   "Success! You now own this listing and can edit it immediately.
    Changes will be reviewed before going live."
   ↓
8. Redirected to /dashboard/vendor/listing
   ↓
9. Can immediately click "Edit"
   ↓
10. Redirects to /submit?claim=true&listingId=XXX
    ↓
11. Shows pre-filled form with existing data
    ↓
12. Makes changes and saves
    ↓
13. If listing was "Live":
    - Status changes to "Pending"
    - Admin must review before it goes back to "Live"
    ↓
14. If listing was "Pending":
    - Stays "Pending"
    - Admin reviews
```

### Current Issues with Path C:
- ✅ FIXED: Now instant ownership (no admin approval)
- ⚠️ Diane's case: Can't claim because not registered
- ⚠️ Free plan limitations (no gallery) not clear upfront
- ⚠️ Edit form shows upgrade options but user might not realize they need to pay

---

## 📋 PLAN COMPARISON & RESTRICTIONS

### Free Plan:
| Feature | Included | Notes |
|---------|----------|-------|
| Basic listing | ✅ Yes | Searchable in directory |
| Profile image | ✅ 1 image | Logo/headshot |
| Gallery images | ❌ 0 images | **RESTRICTION** |
| Edit listing | ✅ Yes | After claiming |
| Featured placement | ❌ No | Below paid listings |
| 101 Approved badge | ❌ No | Premium only |
| Social media links | ✅ Yes | All platforms |
| Contact info | ✅ Yes | Email, phone, website |
| Admin review required | ✅ Yes | Before Live |

### Pro Plan ($50/month):
| Feature | Included |
|---------|----------|
| Everything in Free | ✅ Yes |
| Gallery images | ✅ 4 images |
| Featured placement | ✅ Yes |
| SEO boost | ✅ Yes |
| Priority support | ✅ Yes |

### Premium Plan ($90/month):
| Feature | Included |
|---------|----------|
| Everything in Pro | ✅ Yes |
| 101 Approved badge | ✅ Yes |
| Top priority placement | ✅ Yes |

---

## 🔄 EDIT FLOW (All Plans)

### Current Implementation:
```
1. Vendor goes to /dashboard/vendor/listing
   ↓
2. Sees "My Listings" page
   ↓
3. Clicks "EDIT" button
   ↓
4. Redirected to /submit?claim=true&listingId=XXX
   ↓
5. Form pre-populated with existing data
   ↓
6. Vendor makes changes:
   - Text fields: ✅ All plans
   - Profile image: ✅ All plans
   - Gallery images: 
     * Free: ❌ Disabled (maxImages = 0)
     * Pro: ✅ Enabled (maxImages = 4)
   ↓
7. Clicks "Submit"
   ↓
8. Validation:
   - Check owner_id matches user ID
   - Check RLS policy allows update
   ↓
9. If listing was "Live":
   - Changes status to "Pending"
   - Sends to admin review queue
   ↓
10. Success message:
    "Successfully updated listing. 
     Your changes will be reviewed before going live."
    ↓
11. ⏰ Waits for admin approval
    ↓
12. Admin reviews in /dashboard/admin/listings
    ↓
13. Admin approves: "Pending" → "Live"
    ↓
14. ✅ Changes appear on public directory
```

### Edit Flow Issues:
- ⚠️ Confusing: Free users see gallery upload but it's disabled
- ⚠️ No clear messaging about plan limitations
- ⚠️ Form shows all features but some are locked
- ⚠️ Uses same form for claim and edit (confusing UX)

---

## 🎯 DECISION POINTS IN CURRENT FLOW

### Decision #1: Should we require registration for Free submissions?
**Currently:** NO - can submit without account  
**Problem:** Can't claim or edit later without manual admin intervention

### Decision #2: When should payment happen?
**Currently:** After form submission  
**Problem:** Might lose vendors between form and payment

### Decision #3: Should claims require admin approval?
**Currently:** NO (fixed today)  
**Result:** ✅ Instant ownership

### Decision #4: Should edits require admin approval?
**Currently:** YES - edits go to "Pending"  
**Question:** Should Pro/Premium skip review?

### Decision #5: How do vendors upgrade?
**Currently:** Multiple paths:
- From listing page: "Upgrade Plan" button
- From dashboard: Upgrade links
- From edit form: Plan selector (but doesn't process payment)

---

## 🚨 CURRENT PAIN POINTS

### 1. Diane Christiansen's Issues (REAL EXAMPLE):

**What she experienced:**
- Has Free listing (created by you/imported)
- Never registered an account
- Tried to "claim and edit"
- ❌ Can't claim (not registered)
- ❌ Can't upload gallery images (Free plan)
- ❌ System appears "broken" to her

**What she needs to do:**
1. Register account first
2. Claim listing (instant)
3. Edit text info (works)
4. Upgrade to Pro for gallery images
5. Upload gallery images

### 2. Free Plan Confusion:

**Issue:** Free vendors don't understand limitations
- Form shows gallery upload but it's disabled
- No clear "Upgrade to unlock" messaging
- Might think system is broken

### 3. Multiple Submit Forms:

**Currently have:**
- `free-submit-form.tsx` - Simple free form
- `supabase-submit-form.tsx` - Full paid form
- `edit-form.tsx` - Old Sanity edit form (unused?)
- Different forms for claim vs new submission

### 4. Unclear Upgrade Path:

**Vendors might not know:**
- How to upgrade from Free → Pro
- What features they get with upgrade
- When to upgrade (before or after submission)

---

## 📊 CURRENT STATUS STATES

### Listing Status Flow:
```
New Submission → "Pending" → Admin Approves → "Live"
                    ↓
            Edit while Live → "Pending" → Admin Re-approves → "Live"
```

### Claim Status:
```
Unclaimed → User Claims → ✅ INSTANT OWNERSHIP (is_claimed = true)
```

### Plan Status:
```
Free (default) → User Upgrades → Stripe Payment → Pro/Premium
```

---

## 🔐 AUTHENTICATION REQUIREMENTS

### What Requires Login:
- ✅ Claiming existing listings
- ✅ Editing listings
- ✅ Paid plan submissions
- ✅ Accessing vendor dashboard
- ✅ Upgrading plans

### What Doesn't Require Login:
- ✅ Browsing directory
- ✅ Submitting FREE listings (optional login)
- ✅ Viewing listing details

---

## 💳 PAYMENT INTEGRATION POINTS

### Stripe Integration:
1. **Plan Selection Page** - `/plan-selection?listingId=XXX`
2. **Stripe Checkout** - Hosted by Stripe
3. **Webhook Handler** - `/api/webhook` (stripe-claim and main)
4. **Webhook Updates:**
   - Profile: subscription_plan, billing_cycle, stripe_customer_id
   - Listing: plan field
   - Claims: Auto-creates approved claim record

### Payment Issues:
- ⚠️ Webhook still references old Airtable functions
- ⚠️ Not clear if webhooks are fully working
- ⚠️ No test mode verification

---

## 📁 KEY FILES IN VENDOR FLOW

### Pages:
- `/submit` - Main submission page (2 forms)
- `/submit/success` - Success confirmation
- `/plan-selection` - Stripe plan chooser
- `/dashboard/vendor` - Vendor dashboard
- `/dashboard/vendor/listing` - My Listings page
- `/list-your-business` - Vendor landing page

### Forms:
- `free-submit-form.tsx` - Free plan submission
- `supabase-submit-form.tsx` - Paid plan submission + claim edit
- `edit-form.tsx` - Old form (might be unused)

### Actions:
- `submit-supabase.ts` - Create/update listings
- `claim-listing.ts` - Auto-approve claims (NEW)
- `admin-edit.ts` - Admin can edit any listing

### Components:
- `claim-button.tsx` - Claim CTA on listing pages
- `claim-form.tsx` - Claim modal/form
- `gallery-upload.tsx` - Image gallery (Pro only)
- `image-upload.tsx` - Single profile image

---

## 🎨 USER INTERFACE ELEMENTS

### On Listing Page (Unclaimed):
```
[Claim This Listing] button
  → Opens claim modal
  → Requires login
  → Instant ownership
```

### On Listing Page (Claimed by User):
```
[Edit Listing] button
[View Analytics] button
[Upgrade Plan] button (if Free)
```

### Vendor Dashboard:
```
My Listings
  → Shows all owned listings
  → Status badges: Live/Pending/Rejected
  → Plan badges: Free/Pro/Premium
  → Actions: VIEW, EDIT, WEBSITE
```

---

## 🔢 CURRENT METRICS

### Listings Breakdown:
- **Total listings:** 268
- **Live:** 265
- **Pending:** 3
- **Unclaimed (Free):** 262
- **Claimed:** 6

### Plans Distribution:
```sql
SELECT plan, COUNT(*) 
FROM listings 
WHERE status = 'Live'
GROUP BY plan;
```
Expected results:
- Free: ~250+
- Pro: ~10-15
- Premium: ~5

---

## 🚧 BOTTLENECKS & FRICTION POINTS

### 1. Registration Confusion
**Issue:** Vendors don't know when to register
- Can submit Free without account
- But can't claim or edit later without account
- Creates orphaned submissions

**Impact:** Diane couldn't claim because not registered

### 2. Plan Selection Timing
**Issue:** When should vendor choose plan?
- Option A: Before submission (current paid flow)
- Option B: After submission (current free flow)
- Option C: During claim (current claim flow)

**Confusion:** 3 different paths, different timing

### 3. Gallery Upload Confusion
**Issue:** Free plan users see disabled gallery upload
- No clear "Upgrade to unlock" CTA
- Appears broken instead of gated feature
- Vendor might think system has error

**Impact:** Diane thought uploads were broken

### 4. Admin Approval Delay
**Issue:** Everything requires admin review
- New Free submissions → Pending → Admin → Live
- New Paid submissions → Pending → Admin → Live (even after paying!)
- Edits to Live listings → Pending → Admin → Live

**Impact:** Delay in going live, vendor frustration

### 5. Claim vs Edit Confusion
**Issue:** Same form for claiming and editing
- URL: `/submit?claim=true&listingId=XXX`
- But it's really editing, not submitting
- Confusing for vendors

---

## 🔍 GAPS IN CURRENT FLOW

### Missing Features:
1. **No upsell prompts** - Free users don't see value of upgrading
2. **No plan comparison** - Hard to understand differences
3. **No upgrade flow in edit** - Can select plan but doesn't process payment
4. **No trial or demo** - Can't test Pro features
5. **No downgrade flow** - What if vendor wants to go Pro → Free?

### Missing Notifications:
1. **Claim confirmation email** - When claim approved
2. **Edit approval email** - When changes go Live
3. **Payment receipt** - After Stripe purchase
4. **Reminder emails** - "Claim your listing!"

### Missing Analytics:
1. **Funnel tracking** - How many complete submissions?
2. **Abandonment points** - Where do vendors drop off?
3. **Conversion rate** - Free → Paid upgrades?
4. **Time to live** - How long in "Pending"?

---

## 🎯 WHAT WORKS WELL

### ✅ Strong Points:
1. **Auto-approve claims** - Instant ownership (NEW TODAY)
2. **Dual submission paths** - Free and Paid options
3. **Pre-filled claim forms** - Existing data carried over
4. **Plan flexibility** - Can upgrade anytime
5. **Comprehensive edit form** - All fields editable
6. **Image upload system** - Works well (FIXED TODAY)
7. **Social media integration** - All major platforms

---

## 📝 RECOMMENDATIONS (For Discussion)

### Quick Wins:
1. **Require registration for ALL submissions** - Link submissions to accounts
2. **Auto-approve Paid listings** - They paid, let them go Live faster
3. **Add "Upgrade" upsell in edit form** - When they try to upload gallery
4. **Separate claim flow from edit flow** - Different UX for each
5. **Add plan comparison modal** - Help vendors choose

### Medium Effort:
1. **Onboarding wizard** - Step-by-step for new vendors
2. **Plan preview/demo** - Show what Pro looks like
3. **Email sequences** - Automated follow-ups
4. **Upgrade flow in dashboard** - One-click upgrade
5. **Better Free plan messaging** - "Upgrade to unlock" CTAs

### Bigger Changes:
1. **Instant Live for Paid** - Skip admin review for paid plans
2. **Self-serve editing** - Minor edits skip review
3. **Tiered review** - Only review new submissions, not edits
4. **Trial period** - 7-day Pro trial
5. **Annual billing discount** - Encourage annual commitments

---

## 🎯 SPECIFIC QUESTIONS FOR YOU:

1. **Registration:** Should ALL submissions require account creation?

2. **Admin Review:** Should Paid plans go Live immediately (skip review)?

3. **Free Plan:** Should we allow Free forever, or force upgrade after X days?

4. **Gallery Images:** How to handle Free users trying to upload galleries?
   - Option A: Hard block with "Upgrade" button
   - Option B: Allow upload but don't display until upgraded
   - Option C: Upsell modal when they try

5. **Claim Flow:** Should unclaimed Free listings show "Claim & Upgrade" instead of just "Claim"?

6. **Diane's Listing:** What should we do?
   - Option A: Keep as Free, she registers and claims
   - Option B: Comp her to Pro so she can upload galleries
   - Option C: Reach out and help her through process

---

**This is your complete current vendor flow. What changes do you want to make?** 🎯

