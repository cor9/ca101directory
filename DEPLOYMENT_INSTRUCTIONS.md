# 🚨 CRITICAL MAGIC LINK FIX - DEPLOYMENT REQUIRED

## What Was Broken

Magic link emails were redirecting to homepage (https://directory.childactor101.com) instead of the magic link handler with proper parameters. This caused "OTP expired" errors because the app couldn't extract email/role/redirect info.

## Root Cause

Missing `NEXT_PUBLIC_SITE_URL` environment variable in production. The code had a fallback, but it wasn't working correctly.

## Fixes Implemented

### 1. **Triple Fallback System** ✅
```javascript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                process.env.NEXT_PUBLIC_APP_URL || 
                'https://directory.childactor101.com';
```

### 2. **Updated Files:**
- `src/actions/login.ts` - Fixed magic link URL generation
- `src/actions/register.ts` - Fixed magic link URL generation  
- `src/app/(website)/(public)/auth/expired/page.tsx` - New page for expired tokens
- `src/app/(website)/auth/magic-link/magic-link-handler.tsx` - Better error messaging
- `src/app/(website)/(public)/help/getting-started/page.tsx` - Updated docs

### 3. **Local Environment** ✅
- Added `NEXT_PUBLIC_SITE_URL` to `.env.local`
- Cleaned up duplicate env vars
- Updated anon key to JWT format

---

## 🔧 DEPLOYMENT STEPS (REQUIRED)

### Step 1: Update Vercel Environment Variables

1. Go to: https://vercel.com
2. Select project: **ca101directory**
3. Navigate to: **Settings > Environment Variables**
4. Click: **Add New**
5. Enter:
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://directory.childactor101.com`
6. Apply to: ✓ Production ✓ Preview ✓ Development
7. Click: **Save**

### Step 2: Verify Anon Key (If Not Already Done)

1. While in Environment Variables, find: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Verify it starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT format)
3. If it's `sb_publishable_...`, update it to the JWT anon key from Supabase dashboard

### Step 3: Redeploy

Vercel will automatically redeploy after saving environment variables. Monitor the deployment.

---

## ✅ Testing After Deployment

### Test 1: Admin Login
1. Go to: https://directory.childactor101.com/auth/login
2. Enter: corey@childactor101.com
3. Check "Remember me"
4. Click: "Send me a login link"
5. Check email immediately
6. **CLICK the button** (don't copy/paste the URL)
7. Should redirect to admin dashboard ✅

### Test 2: Vendor Claim (Autumn)
1. Send Autumn this link:
```
https://directory.childactor101.com/claim/eyJsaWQiOiJmNmVlNmY0OS0yODI0LTQ0OWEtOGMxZC1lODMzM2ZjNDJjZTMiLCJleHAiOjE3NjMzNTM3MTl9.lZtoRMMWm3u-BouzIZ6g6YGYkCCEitt6uisZKxYfhaI?lid=f6ee6f49-2824-449a-8c1d-e8333fc42ce3
```

2. She clicks "Create account" or "Log in"
3. Enters email: lifecoachingbycamille@gmail.com
4. Checks email
5. **CLICKS the button** in the email
6. Should complete claim flow and access vendor dashboard ✅

---

## 📊 Expected Email Format (After Fix)

**Before (Broken):**
```
redirect_to: https://directory.childactor101.com
```

**After (Fixed):**
```
redirect_to: https://directory.childactor101.com/auth/magic-link?email=corey@childactor101.com&role=admin&remember=1&redirectTo=/dashboard/admin&intent=login
```

---

## ⚠️ Important Notes

1. **ALWAYS CLICK the email button** - Don't copy/paste the URL text
2. **Magic links expire after 1 hour** - Check Supabase auth settings if you need longer
3. **One-time use** - Each magic link can only be clicked once
4. **Email delivery** - Allow 1-2 minutes for email to arrive

---

## 🔐 Security Reminders

- `.env.local.backup` was removed from git history (exposed secrets)
- Rotate the following keys if concerned:
  - Google OAuth credentials
  - Airtable Personal Access Token
  - Stripe API keys (already rotated on Nov 2)
  - Supabase service role key (already rotated on Nov 2)

---

## 🎯 Success Criteria

- ✅ Magic link emails include full URL with parameters
- ✅ Clicking magic link redirects to correct dashboard
- ✅ No more "OTP expired" errors on fresh links
- ✅ Sessions persist for 30 days (if "remember me" checked)
- ✅ Autumn can claim her listing and upload images

---

**Last Updated:** November 2, 2025  
**Deployed By:** Corey  
**Status:** Ready to deploy to production
