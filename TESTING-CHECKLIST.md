# Testing Checklist - November 2, 2025

## ✅ Fixed Today (Completed)

### 1. Users vs Profiles Table Conflict
- [x] Changed webhook to use `profiles` instead of `users`
- [x] Changed admin users page to use `profiles`
- [x] Verified all code uses `profiles` table only
- [x] Removed redundant DashboardGuard components
- [x] Added proper server-side security checks

**Result:** Login loops fixed, vendor payments will work, admin dashboard shows correct data

---

## 🔄 In Progress (Codex)

### 2. Magic Link Authentication (Proposal 1)
- [ ] Remove password fields from signup/login forms
- [ ] Configure Supabase for magic link auth
- [ ] Update auth actions to use magic link
- [ ] Set long session durations (90d admin, 30d parent, 7d vendor)
- [ ] Add "Check your email" confirmation pages
- [ ] Update email templates

---

## ⏳ Testing Needed (After Codex Completes)

### Test 1: Admin Magic Link Login
**Steps:**
1. Go to `/auth/login`
2. Enter admin email: `corey@childactor101.com`
3. Click "Send Login Link"
4. Check email for magic link
5. Click link in email
6. Should redirect to `/dashboard/admin`
7. Verify session persists (close browser, reopen, still logged in)

**Expected:** Admin dashboard loads, no redirect loops, stays logged in for 90 days

---

### Test 2: Vendor Signup with Magic Link
**Steps:**
1. Go to `/auth/signup`
2. Enter name and email
3. Select "Professional/Vendor" role
4. Click signup button (no password needed)
5. Check email for verification/magic link
6. Click link
7. Should redirect to vendor dashboard or claim flow

**Expected:** Account created with "vendor" role in profiles table

---

### Test 3: Vendor Payment Flow
**Steps:**
1. Vendor receives email about claim listing
2. Clicks payment link
3. Goes through Stripe checkout
4. Webhook should find vendor in `profiles` table ✅ (fixed today)
5. Listing gets claimed and owner_id set
6. Vendor can login and see listing

**Expected:** No more "user not found" errors in webhook

---

### Test 4: Admin Users Page
**Steps:**
1. Login as admin
2. Go to `/dashboard/admin/users`
3. Verify table shows:
   - Correct user emails
   - Correct roles (vendor, admin, not "USER")
   - Data from `profiles` table ✅ (fixed today)

**Expected:** Shows 19 users with proper roles

---

### Test 5: Session Duration
**Steps:**
1. Login as admin
2. Note the time
3. Close browser completely
4. Wait 5 minutes
5. Reopen browser and go to `/dashboard/admin`

**Expected:** Still logged in (90-day session should persist)

---

### Test 6: Role Selector Still Works
**Steps:**
1. Go to `/auth/signup`
2. Verify role selector shows:
   - Parent/Legal Guardian (if enabled)
   - Professional/Vendor
3. Select vendor and signup
4. Verify `profiles` table gets correct role

**Expected:** Role selector unchanged, just password removed

---

## 🚨 Issues to Watch For

### Potential Problems:
1. **Email delivery delays** - Magic link might take time to arrive
2. **Magic link expiry** - Default is 1 hour, might need adjustment
3. **Session not persisting** - Check cookie settings
4. **Supabase config** - Make sure magic link is enabled in dashboard
5. **Callback URL** - Verify redirect after clicking magic link

### Debug Tools:
- Browser DevTools → Application → Cookies (check session cookies)
- Supabase Dashboard → Authentication → Users (verify user creation)
- Supabase Dashboard → Logs (check for auth errors)
- Browser Console (check for JavaScript errors)

---

## 📝 Success Criteria

Before deploying to production, verify:

- [ ] Admin can login with magic link (no password)
- [ ] Admin stays logged in for days/weeks
- [ ] Vendor signup works (creates account in `profiles` table)
- [ ] Vendor payment flow works (webhook finds vendor)
- [ ] Admin users page shows correct data
- [ ] No redirect loops on any dashboard
- [ ] Role selector still functions correctly
- [ ] Email delivery works (magic links arrive)
- [ ] Sessions persist across browser restarts

---

## 🎯 Key Improvements Made Today

1. **Fixed Table Confusion** ✅
   - Standardized on `profiles` table
   - Removed `users` table references
   - All role data now consistent

2. **Fixed Redirect Loops** ✅
   - Removed redundant DashboardGuard
   - Server-side security only
   - Clean authentication flow

3. **Magic Link Auth** 🔄 (In Progress)
   - Simpler UX (no passwords)
   - Better security
   - Mobile-friendly
   - Long sessions for admin/parents

---

## 📞 Support Checklist

If users report issues after deploy:

1. **"Can't log in"**
   - Check: Did they receive magic link email?
   - Check: Did magic link expire? (resend)
   - Check: Is email in spam folder?

2. **"Keeps logging me out"**
   - Check: Session duration configured correctly?
   - Check: Browser blocking cookies?
   - Check: Using incognito/private mode?

3. **"Payment not working"**
   - Check: Webhook logs (should find user in profiles table now)
   - Check: User exists in profiles table
   - Check: Stripe webhook firing correctly

4. **"Wrong dashboard"**
   - Check: User's role in profiles table
   - Check: verifyDashboardAccess logs
   - Should be fixed with today's changes ✅

---

## 🚀 Deployment Steps (After Testing)

1. Commit changes:
   ```bash
   git add .
   git commit -m "Fix: Standardize on profiles table + Add magic link auth"
   git push
   ```

2. Verify Vercel deployment builds successfully

3. Check production Supabase settings:
   - Magic link enabled
   - Session duration configured
   - Email templates updated

4. Monitor logs for first 24 hours

5. Send email to existing users:
   "We've upgraded to passwordless login! Next time you log in, we'll send you a secure link."

---

## ✅ Ready to Deploy When:

- [x] Table conflict fixed (completed)
- [ ] Magic link implemented (Codex in progress)
- [ ] All tests pass
- [ ] No console errors
- [ ] Admin tested and working
- [ ] Vendor flow tested
- [ ] Documentation updated

---

**Last Updated:** November 2, 2025
**Status:** In Progress - Waiting for Codex to complete magic link implementation

