import { auth } from "@/auth";
import {
  isAdminDashboardEnabled,
  isParentDashboardEnabled,
  isVendorDashboardEnabled,
} from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getRole } from "@/lib/auth/roles";
import { getSafeDashboardRedirect } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Dashboard - Child Actor 101 Directory",
  description:
    "Your dashboard for managing your Child Actor 101 Directory account",
  canonicalUrl: `${siteConfig.url}/dashboard`,
});

/**
 * Dashboard page - Strict role-based router with no fallbacks
 *
 * Phase 4.1: Dashboard Redesign & Role Separation
 *
 * Role-based routing (strict):
 * - guest → /auth/login (never see dashboard)
 * - parent → /dashboard/parent (only if parent features enabled)
 * - vendor → /dashboard/vendor (only if vendor features enabled)
 * - admin → /dashboard/admin (only if admin features enabled)
 *
 * No cross-role fallbacks or leakage between dashboards
 */
export default async function DashboardPage() {
  const session = await auth();

  // Debug logging
  console.log("=== DASHBOARD PAGE DEBUG ===");
  console.log("Session:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    userRole: (session?.user as any)?.role,
    fullUser: session?.user,
  });

  // Guests are never allowed to access dashboard
  if (!session?.user) {
    console.log("Dashboard: No session, redirecting to login");
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  const userRole = getRole(session.user as any);
  console.log("Dashboard: Detected user role:", userRole);
  console.log("Dashboard: User object:", JSON.stringify(session.user, null, 2));

  // Use safe dashboard redirect to prevent wrong dashboard access
  const safeRedirectUrl = getSafeDashboardRedirect(session.user as any);
  console.log("Dashboard: Safe redirect URL:", safeRedirectUrl);

  // Strict role-based routing with feature flag checks
  switch (userRole) {
    case "admin": {
      console.log(
        "Dashboard: Admin role detected, checking admin dashboard enabled",
      );
      const adminEnabled = isAdminDashboardEnabled();
      console.log("Dashboard: Admin dashboard enabled:", adminEnabled);

      if (adminEnabled) {
        console.log("Dashboard: Redirecting admin to /dashboard/admin");
        redirect("/dashboard/admin");
      } else {
        console.log(
          "Dashboard: Admin dashboard disabled, redirecting to login",
        );
        // Admin features disabled, redirect to login
        redirect("/auth/login");
      }
      break;
    }

    case "vendor": {
      if (isVendorDashboardEnabled()) {
        // Vendors always go to vendor dashboard (no fallback to parent)
        redirect("/dashboard/vendor");
      } else {
        // Vendor features disabled, redirect to login
        redirect("/auth/login");
      }
      break;
    }

    case "parent": {
      if (isParentDashboardEnabled()) {
        redirect("/dashboard/parent");
      } else {
        // Parent features disabled, redirect to login
        redirect("/auth/login");
      }
      break;
    }

    default: {
      console.log("Dashboard: Unknown role detected:", userRole);
      console.log(
        "Dashboard: Full user object for debugging:",
        JSON.stringify(session.user, null, 2),
      );
      console.log("Dashboard: Redirecting to login");
      // Guests and unknown roles are never allowed to access dashboard
      redirect("/auth/login?callbackUrl=/dashboard");
      break;
    }
  }
}
