import { auth } from "@/auth";
import {
  isAdminDashboardEnabled,
  isParentDashboardEnabled,
  isVendorDashboardEnabled,
} from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getRole } from "@/lib/auth/roles";
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

  // Guests are never allowed to access dashboard
  if (!session?.user) {
    redirect("/auth/login?next=/dashboard");
  }

  const userRole = getRole(session.user as any);

  // Strict role-based routing with feature flag checks
  switch (userRole) {
    case "admin": {
      if (isAdminDashboardEnabled()) {
        redirect("/dashboard/admin");
      } else {
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
      // Guests and unknown roles are never allowed to access dashboard
      redirect("/auth/login?next=/dashboard");
      break;
    }
  }
}
