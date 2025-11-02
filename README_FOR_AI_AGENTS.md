# 🤖 README FOR AI AGENTS

**Last Updated:** November 2, 2025, 2:30 AM

---

## 🚨 CRITICAL: READ BEFORE ANY AUTH/DASHBOARD/ROLE WORK

If you're working on:
- Authentication
- User roles
- Dashboards (admin, vendor, parent)
- Login/signup flows
- User data queries
- Webhook processing

**STOP and read this first!**

---

## 📚 Required Reading Order

### 1. **START HERE:** `NOVEMBER_2_2025_FIXES.md`
**Location:** `/Users/coreyralston/ca101directory/NOVEMBER_2_2025_FIXES.md`

This 19 KB document contains:
- ✅ Complete root cause analysis of all issues
- ✅ Detailed fix documentation
- ✅ Before/after code comparisons
- ✅ All files changed with line numbers
- ✅ Database state and architecture decisions
- ✅ Testing procedures

**Read this ENTIRE file before making any changes.**

---

### 2. **Dashboard Work:** `ADMIN_DASHBOARD_REBUILD.md`
**Location:** `/Users/coreyralston/ca101directory/ADMIN_DASHBOARD_REBUILD.md`

Read this if working on admin dashboard:
- ✅ Component architecture
- ✅ What was removed and why
- ✅ Data fetching patterns
- ✅ Design decisions

---

### 3. **Testing:** `TESTING-CHECKLIST.md`
**Location:** `/Users/coreyralston/ca101directory/TESTING-CHECKLIST.md`

Complete testing procedures for:
- ✅ Admin login
- ✅ Vendor signup/payment
- ✅ Dashboard functionality
- ✅ Role verification

---

### 4. **Context History:** `.cursor/context_Decisions.md`
**Location:** `/Users/coreyralston/ca101directory/.cursor/context_Decisions.md`

Historical decisions and patterns. **Read the top section (lines 1-80) for critical rules.**

---

## ⚠️ CRITICAL RULES - DO NOT BREAK THESE

### 🚫 NEVER DO:

1. **NEVER use the `users` table for role lookups**
   ```typescript
   // ❌ WRONG - will get outdated role data
   await supabase.from("users").select("role")
   ```

2. **NEVER add `DashboardGuard` to dashboard pages**
   ```typescript
   // ❌ WRONG - causes redirect loops
   return (
     <DashboardGuard allowedRoles={["admin"]}>
       <AdminDashboard />
     </DashboardGuard>
   );
   ```

3. **NEVER use `name` field from profiles**
   ```typescript
   // ❌ WRONG - field doesn't exist
   .select("name")
   ```

4. **NEVER add features to admin dashboard that don't exist**
   ```typescript
   // ❌ WRONG - badge applications don't exist yet
   <Link href="/dashboard/admin/badge-applications">
   ```

---

### ✅ ALWAYS DO:

1. **ALWAYS use the `profiles` table for user data**
   ```typescript
   // ✅ CORRECT
   const { data: users } = await supabase
     .from("profiles")
     .select("id, email, full_name, role, created_at");
   ```

2. **ALWAYS use server-side security checks ONLY**
   ```typescript
   // ✅ CORRECT
   export default async function AdminDashboard() {
     const user = await currentUser();
     verifyDashboardAccess(user, "admin", "/dashboard/admin");

     return (
       <AdminDashboardLayout> {/* No client-side guard */}
         <AdminDashboardClient />
       </AdminDashboardLayout>
     );
   }
   ```

3. **ALWAYS use `full_name` field**
   ```typescript
   // ✅ CORRECT
   .select("id, email, full_name, role")
   ```

4. **ALWAYS fetch real data for admin dashboard**
   ```typescript
   // ✅ CORRECT
   const { data: users } = await supabase
     .from("profiles")
     .select("id, role");

   const totalUsers = users?.length || 0;
   // Display real count, not hardcoded zero
   ```

---

## 🗄️ Database Architecture

### Current State (November 2, 2025):

```sql
-- profiles table ✅ USE THIS
19 users total:
- 16 vendors
- 3 admins

Fields:
- id (uuid)
- email (text)
- full_name (text) ← Use this, not "name"
- role (text) ← Accurate role data
- created_at (timestamp)
- updated_at (timestamp)

-- users table ❌ IGNORE THIS (outdated)
23 users total:
- ALL have role="USER" (generic, useless)

This table exists but is NOT used anymore.
Do NOT query it for roles or user data.
```

### Listings:
```
285 total listings:
- 279 Live
- 3 Pending
- 2 Rejected
- 1 Archived

10 claimed, 275 unclaimed
```

---

## 🏗️ Component Architecture

### Admin Dashboard:
```
Page: src/app/(website)/(protected)/dashboard/admin/page.tsx
Component: src/components/admin/admin-dashboard-client-new.tsx

Flow:
1. Server component fetches data
2. Runs verifyDashboardAccess() (server-side security)
3. Fetches real user counts from profiles table
4. Passes data to client component
5. Client component renders with real data

Security: Server-side ONLY (no client-side guards)
```

### Vendor Dashboard:
```
Page: src/app/(website)/(protected)/dashboard/vendor/page.tsx

Flow:
1. Server component checks auth
2. Runs verifyDashboardAccess() (server-side)
3. Fetches vendor's listings
4. Renders dashboard

Security: Server-side ONLY (no client-side guards)
```

### Parent Dashboard:
```
Page: src/app/(website)/(protected)/dashboard/parent/page.tsx

Flow:
1. Server component checks auth
2. Runs verifyDashboardAccess() (server-side)
3. Fetches favorites and reviews (if enabled)
4. Renders dashboard

Security: Server-side ONLY (no client-side guards)
```

---

## 🔐 Authentication Pattern

### Correct Pattern:
```typescript
// In any protected page:
export default async function ProtectedPage() {
  // 1. Get current user
  const user = await currentUser();

  // 2. Check if authenticated
  if (!user?.id) {
    redirect("/auth/login");
  }

  // 3. Verify role access (server-side)
  verifyDashboardAccess(user, "admin", "/dashboard/admin");

  // 4. Fetch data and render
  const data = await getData();
  return <PageContent data={data} />;
}
```

### Why This Works:
- ✅ Server-side execution (no client hydration issues)
- ✅ Single source of truth (server determines access)
- ✅ No timing conflicts between server/client
- ✅ Clean redirect flow
- ✅ No loops

---

## 🐛 Common Mistakes to Avoid

### Mistake 1: Querying Wrong Table
```typescript
// ❌ WRONG
const { data } = await supabase
  .from("users")
  .select("role"); // Gets outdated "USER" role

// ✅ CORRECT
const { data } = await supabase
  .from("profiles")
  .select("role"); // Gets accurate role
```

### Mistake 2: Client-Side Guards
```typescript
// ❌ WRONG - causes loops
<DashboardGuard allowedRoles={["admin"]}>
  <Content />
</DashboardGuard>

// ✅ CORRECT - server-side only
// In server component:
verifyDashboardAccess(user, "admin", "/path");
return <Content />;
```

### Mistake 3: Wrong Field Names
```typescript
// ❌ WRONG
.select("name") // Field doesn't exist

// ✅ CORRECT
.select("full_name")
```

### Mistake 4: Hardcoded Stats
```typescript
// ❌ WRONG
<div>Total Users: 0</div>

// ✅ CORRECT
const totalUsers = users?.length || 0;
<div>Total Users: {totalUsers}</div>
```

---

## 📝 Checklist Before Making Changes

Before modifying auth/dashboard/role code:

- [ ] Read `NOVEMBER_2_2025_FIXES.md` in full
- [ ] Understand why redirect loops happened
- [ ] Know difference between `users` and `profiles` tables
- [ ] Understand server-side vs client-side security
- [ ] Review the files already changed (see docs)
- [ ] Check if similar code exists elsewhere
- [ ] Test locally before committing
- [ ] Update documentation if needed

---

## 🚀 Quick Reference

### User Queries:
```typescript
// Get all users
const { data: users } = await supabase
  .from("profiles")
  .select("id, email, full_name, role, created_at");

// Get user by email
const { data: user } = await supabase
  .from("profiles")
  .select("*")
  .eq("email", email)
  .single();

// Count by role
const vendors = users?.filter(u => u.role === "vendor").length || 0;
const admins = users?.filter(u => u.role === "admin").length || 0;
```

### Security Checks:
```typescript
// In server component
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";

const user = await currentUser();
verifyDashboardAccess(user, "admin", "/dashboard/admin");
```

### Webhook User Lookup:
```typescript
// In webhook processing
const { data: userData } = await supabase
  .from("profiles") // Not "users"
  .select("id")
  .eq("email", customerEmail)
  .single();
```

---

## 🎯 Summary

**Three Major Issues Fixed November 2, 2025:**

1. **Redirect Loops:** Removed client-side guards
2. **Wrong Table:** Standardized on `profiles` table
3. **Broken Dashboard:** Rebuilt with real data

**Key Takeaways:**
- Use `profiles` table for everything
- Server-side security only
- Real data, no placeholders
- Clean, focused interfaces

**Before Making Changes:**
Read the docs, understand the patterns, test thoroughly.

---

## 📞 Questions?

If you're unsure about a change:
1. Check `NOVEMBER_2_2025_FIXES.md` first
2. Look for similar code in the codebase
3. Test locally before committing
4. When in doubt, use server-side security and `profiles` table

---

**Remember:** These fixes took 1.5 hours to diagnose and implement. Don't break them by reverting to old patterns! 🙏

---

**Last Updated:** November 2, 2025, 2:30 AM
**Status:** All fixes complete, tested locally, documented
**Next:** Manual testing → Deploy

