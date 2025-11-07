# Amber Bohac / ActorSite Account Diagnosis

**Date:** November 6, 2025
**Issue:** Seeing Free plan instead of Pro, can't upload gallery images

---

## ✅ WHAT I FOUND

### Database Status (Confirmed)
- **Listing:** ActorSite (ID: da084a22-5f0a-4a7b-8de7-1b05f6479667)
- **Plan:** Pro ✅
- **Owner Email:** actorsite@actorsite.com
- **Is Claimed:** Yes
- **Status:** Active

### The Real Problem
The frontend code had a bug where it didn't recognize "Pro" plan correctly in the vendor dashboard, showing "Free" instead. **This is now FIXED.**

---

## 🚫 WHY NOT TO CANCEL & RE-SUBSCRIBE

1. **You'll lose the listing ownership** - Would have to reclaim it
2. **You'll lose any customizations** - Profile image, gallery, etc.
3. **Payment processing delays** - Could take time to re-activate
4. **The problem is already fixed** - It was a display bug, not a billing issue

---

## ✅ WHAT TO TELL AMBER

### Short Version
"Your Pro subscription is active and working correctly! The issue was a display bug on our end that's now fixed. Just log out and back in, and you'll see your Pro features."

### Detailed Response
Hi Amber,

Good news! I found the issue and it's already fixed:

**What happened:**
- Your Pro subscription IS active and working
- The listing was showing "Free" due to a display bug in our code
- Your payment is processing correctly

**The fix:**
- I just deployed a code update that fixes the display issue
- Your account and subscription are fine - no need to cancel anything!

**What you need to do:**
1. Log out of your account at actorsite@actorsite.com
2. Clear your browser cache (or use incognito/private mode)
3. Log back in
4. You should now see "Pro" badge and have access to:
   - Gallery upload (4 images)
   - All Pro-tier features

**Important:** Please don't cancel your subscription! Everything is working on the backend. The "upgrade" prompt you're seeing is just because the old code didn't recognize your Pro status. After you log back in with the fix deployed, it will work correctly.

Let me know if you still see issues after logging back in!

Best,
[Your name]

---

## 🔧 TECHNICAL FIXES APPLIED

1. **Vendor Dashboard Plan Detection** (Fixed Nov 6)
   - Changed from exact case-sensitive match to case-insensitive
   - Now recognizes: "Pro", "Founding Pro", comped listings

2. **Edit Form Gallery Upload** (Fixed Nov 6)
   - Added support for "Founding Pro" plan
   - Gallery upload now visible for all Pro-tier users

3. **Listing Sort Order** (Fixed Nov 6)
   - Pro listings now properly prioritized above Free

---

## 📋 IF ISSUE PERSISTS

Run this query to check for duplicate accounts:
```sql
SELECT id, email, role, created_at
FROM profiles
WHERE email ILIKE '%actorsite%'
ORDER BY created_at;
```

If there ARE two accounts, we can merge them. But based on current data, there's only one account with one listing.

