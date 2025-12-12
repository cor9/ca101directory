/**
 * Dashboard Safety Checks
 * Prevents users from being sent to wrong dashboards due to role detection issues
 */

import { getRole } from "@/lib/auth/roles";
import type { ExtendedUser } from "@/types/next-auth";
import { redirect } from "next/navigation";

/**
 * Verify user has correct role for dashboard access
 * Throws error if user tries to access wrong dashboard
 */
export function verifyDashboardAccess(
  user: ExtendedUser,
  requiredRole: "admin" | "vendor" | "parent",
  dashboardPath: string,
) {
  const userRole = getRole(user);

  console.log("Dashboard Safety Check:", {
    userEmail: user.email,
    userRole,
    requiredRole,
    dashboardPath,
    hasAccess: userRole === requiredRole,
  });

  if (userRole !== requiredRole) {
    console.error("🚨 DASHBOARD SAFETY VIOLATION:", {
      userEmail: user.email,
      userRole,
      requiredRole,
      dashboardPath,
      message: `User with role '${userRole}' tried to access '${requiredRole}' dashboard`,
    });

    // Redirect to appropriate dashboard based on actual role
    switch (userRole) {
      case "admin":
        redirect("/dashboard/admin");
        break;
      case "vendor":
        redirect("/dashboard/vendor");
        break;
      case "parent":
        redirect("/dashboard/parent");
        break;
      default:
        redirect("/auth/login?error=invalid_role");
        break;
    }
  }

  return true;
}

/**
 * Get safe dashboard redirect based on user role
 * Never sends user to wrong dashboard
 */
export function getSafeDashboardRedirect(user: ExtendedUser | null): string {
  if (!user) {
    return "/auth/login";
  }

  const userRole = getRole(user);

  console.log("Safe Dashboard Redirect:", {
    userEmail: user.email,
    userRole,
  });

  switch (userRole) {
    case "admin":
      return "/dashboard/admin";
    case "vendor":
      return "/dashboard/vendor";
    case "parent":
      return "/dashboard/parent";
    case "guest":
    default:
      return "/auth/login?error=no_role";
  }
}
