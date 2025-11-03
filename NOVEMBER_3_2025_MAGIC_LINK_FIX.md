# November 3, 2025 - Magic Link Authentication Fix

## Executive Summary

**Issue:** Magic link emails were not functioning correctly, showing "OTP expired" errors within minutes of receiving the email, even though Supabase OTP tokens should last 1 hour.

**Root Cause:** Missing `NEXT_PUBLIC_SITE_URL` environment variable caused magic link emails to redirect to the homepage instead of the magic link handler with required parameters.

**Resolution:** Implemented triple fallback system for site URL, added missing environment variables, fixed anon key format, and improved error messaging.

**Status:** ✅ FIXED - Verified working in production on November 3, 2025

---

## Timeline of Events

### Initial Report
**User:** "when i copy and paste link. which is an option in the email as i got as it should be... it was not an hour. it was a couple minutes"

### Investigation Phase

1. **Examined magic link email content:**
   ```
   redirect_to: https://directory.childactor101.com
   ```
   Expected: Full URL with query params (email, role, remember, redirectTo, intent)

2. **Identified missing environment variable:**
   - Code expected: `NEXT_PUBLIC_SITE_URL`
   - Production only had: `NEXT_PUBLIC_APP_URL`
   - Fallback worked but URL construction was incomplete

3. **Found additional issues:**
   - Anon key in wrong format (`sb_publishable_` instead of JWT)
   - Copy/paste breaking long URLs
   - Poor error messaging

### Resolution Phase

1. **Fixed URL generation** (login.ts, register.ts)
2. **Added environment variables** (local + Vercel)
3. **Updated anon key format** (JWT)
4. **Improved error handling** (new /auth/expired page)
5. **Updated documentation** (help pages, deployment guide)
6. **Tested in production** ✅

---

## Technical Details

### The Problem

**Magic Link Email (Broken):**
```
https://crkrittfvylvbtjetxoa.supabase.co/auth/v1/verify?token=ABC123&type=magiclink&redirect_to=https://directory.childactor101.com
```

**What Happened:**
1. User clicks link
2. Supabase verifies token ✅
3. Supabase redirects to: `https://directory.childactor101.com#access_token=...`
4. Homepage loads (no magic link handler)
5. No email/role params to extract
6. App shows "token expired" error ❌

**Magic Link Email (Fixed):**
```
https://crkrittfvylvbtjetxoa.supabase.co/auth/v1/verify?token=ABC123&type=magiclink&redirect_to=https://directory.childactor101.com/auth/magic-link?email=corey@childactor101.com&role=admin&remember=1&redirectTo=/dashboard/admin&intent=login
```

**What Happens Now:**
1. User clicks link
2. Supabase verifies token ✅
3. Supabase redirects to: `/auth/magic-link?email=...&role=...#access_token=...`
4. Magic link handler loads ✅
5. Handler extracts email, role from query params ✅
6. Handler extracts access_token, refresh_token from hash ✅
7. Handler calls signIn("credentials") ✅
8. User redirected to correct dashboard ✅

---

## Code Changes

### 1. Triple Fallback System

**File:** `src/actions/login.ts`
```javascript
// BEFORE
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://directory.childactor101.com';

// AFTER
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                process.env.NEXT_PUBLIC_APP_URL || 
                'https://directory.childactor101.com';
```

**File:** `src/actions/register.ts`
```javascript
// Same change as login.ts
```

### 2. Environment Variables

**Added to `.env.local`:**
```bash
NEXT_PUBLIC_SITE_URL=https://directory.childactor101.com
```

**Added to Vercel:**
- Variable: `NEXT_PUBLIC_SITE_URL`
- Value: `https://directory.childactor101.com`
- Scope: Production, Preview, Development

**Fixed in both:**
```bash
# OLD (wrong format)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_WO4BaY39jrwhzUUvw-R7HQ_7JD0AYEE

# NEW (correct JWT format)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNya3JpdHRmdnlsdmJ0amV0eG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTgzNDcsImV4cCI6MjA3NDA3NDM0N30.Z68lA8dnUXb0XsJSxHWXEE3DsFkUdgogxGOmzbmYyXA
```

### 3. Error Handling Improvements

**New File:** `src/app/(website)/(public)/auth/expired/page.tsx`
- Dedicated page for expired magic links
- Clear messaging about 1-hour expiry
- "Request New Magic Link" button
- Tips for users

**Updated:** `src/app/(website)/auth/magic-link/magic-link-handler.tsx`
- Better error message for expired tokens
- Line 172: "Magic links expire after 1 hour for security. Request a new one to log in."

**Updated:** `src/app/(website)/(public)/help/getting-started/page.tsx`
- Added note: "Click it within 1 hour (links expire for security)"
- Added tip: "If your link expires, just request a new one"

---

## Deployment Steps

### 1. Local Environment ✅
```bash
# Added to .env.local
NEXT_PUBLIC_SITE_URL=https://directory.childactor101.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (JWT format)
```

### 2. Vercel Environment ✅
1. Settings → Environment Variables → Add New
2. Name: `NEXT_PUBLIC_SITE_URL`
3. Value: `https://directory.childactor101.com`
4. Apply to: Production, Preview, Development
5. Save (auto-redeploys)

### 3. Verify Deployment ✅
- Tested admin login with magic link
- Email received within 1-2 minutes
- Clicked "Sign me in" button
- Redirected to admin dashboard
- Session persisted with "remember me"

---

## Testing Results

### ✅ Admin Login Test (Nov 3, 2025)
- **Email:** corey@childactor101.com
- **Request time:** 8:45 PM PST
- **Email arrival:** 8:46 PM PST (1 minute)
- **Clicked button:** 8:46 PM PST (immediately)
- **Result:** SUCCESS - Redirected to admin dashboard
- **Session:** Persisted with 30-day expiry (remember me checked)

### ⏳ Vendor Claim Test (Pending)
- **Email:** lifecoachingbycamille@gmail.com
- **Listing:** Coaching by Camille
- **Claim Link:** Generated and ready
- **Status:** Waiting for user to test
- **Expected:** Account creation → Magic link → Claim completion → Image upload

---

## Key Learnings

### 1. Environment Variables Are Critical
- Always have multiple fallbacks
- Test in production environment
- Don't assume fallbacks work without verification

### 2. Email Links vs. Copy/Paste
- Users may copy/paste URLs from emails
- Long URLs can wrap and break
- Always tell users to CLICK the button, not copy/paste

### 3. Error Messages Matter
- "Token expired" was misleading (token was valid, URL was wrong)
- Clear error messages reduce support burden
- Provide actionable solutions in error UI

### 4. Key Formats Matter
- JWT vs. `sb_publishable_` formats are NOT interchangeable
- Supabase auth library expects specific formats
- Wrong format = cryptic "Invalid API key" errors

### 5. Documentation Prevents Repetition
- Comprehensive docs saved hours of debugging
- Future AI agents can reference these fixes
- Users benefit from updated help pages

---

## Prevention Checklist

For future AI agents working on authentication:

- [ ] ✅ USE triple fallback for site URL: `SITE_URL || APP_URL || hardcoded`
- [ ] ✅ VERIFY env vars exist in both local AND production
- [ ] ✅ USE JWT format for `NEXT_PUBLIC_SUPABASE_ANON_KEY` (starts with `eyJ...`)
- [ ] 🚫 NEVER use `sb_publishable_...` format for anon key
- [ ] ✅ ALWAYS include full path in magic link URLs: `/auth/magic-link`
- [ ] ✅ ALWAYS include query params: email, role, remember, redirectTo, intent
- [ ] ✅ TEST actual production emails (not just localhost)
- [ ] 🚫 NEVER commit `.env.local` or `.env.local.backup` files
- [ ] ✅ TELL users to click button, not copy/paste URL
- [ ] ✅ EXPLAIN 1-hour expiry upfront
- [ ] ✅ PROVIDE clear "Request New Link" option in error states

---

## Files Modified

1. `src/actions/login.ts` - Triple fallback for site URL
2. `src/actions/register.ts` - Triple fallback for site URL
3. `src/app/(website)/(public)/auth/expired/page.tsx` - NEW: Expired token page
4. `src/app/(website)/auth/magic-link/magic-link-handler.tsx` - Better error messaging
5. `src/app/(website)/(public)/help/getting-started/page.tsx` - Updated for 1-hour expiry
6. `.env.local` - Added SITE_URL, fixed anon key format
7. `.cursor/context_Decisions.md` - Comprehensive documentation
8. `DEPLOYMENT_INSTRUCTIONS.md` - NEW: Deployment guide

---

## Security Notes

### Exposed Secrets (Resolved)
- Accidentally committed `.env.local.backup` with secrets
- Deleted file and rewrote git history (force push)
- Secrets already rotated on Nov 2 (Stripe, Supabase service role)
- No action required for Google OAuth or Airtable (can rotate if concerned)

### Best Practices
- Never commit env files
- Use `.gitignore` for sensitive files
- Rotate keys immediately if exposed
- Use Vercel environment variables for production secrets

---

## Success Metrics

- ✅ Magic link emails generate correct URLs
- ✅ Admin login working in production
- ✅ Sessions persist for 30 days (remember me)
- ✅ Error messages clear and actionable
- ✅ Help pages updated and accurate
- ✅ No exposed secrets in git history
- ✅ Comprehensive documentation for future reference

---

**Date:** November 3, 2025  
**Author:** Corey (with AI assistance)  
**Status:** Production-ready and verified working  
**Next Steps:** Send claim link to Autumn for vendor testing
