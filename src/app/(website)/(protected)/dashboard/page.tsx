import { auth } from "@/auth";
import {
  isAdminDashboardEnabled,
  isParentDashboardEnabled,
  isVendorDashboardEnabled,
} from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { userHasListings } from "@/lib/api/listings";
import { getDashboardRoute, getRole } from "@/lib/auth/roles";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Dashboard - Child Actor 101 Directory",
  description:
    "Your dashboard for managing your Child Actor 101 Directory account",
  canonicalUrl: `${siteConfig.url}/dashboard`,
});

/**
 * Dashboard page - Smart router that redirects users based on their role
 *
 * Role-based routing:
 * - vendor → /dashboard/vendor
 * - parent → /dashboard/parent
 * - admin → /dashboard/admin
 * - guest → /auth/login
 *
 * For vendors, also check if they have listings to determine if they should
 * be treated as a vendor or fall back to parent dashboard
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userRole = getRole(session.user as any);

  // Handle role-based routing with feature flag checks
  switch (userRole) {
    case "admin": {
      if (isAdminDashboardEnabled()) {
        redirect("/dashboard/admin");
      } else {
        redirect("/auth/login");
      }
      break;
    }

    case "vendor": {
      if (isVendorDashboardEnabled()) {
        // Check if vendor actually has listings
        const hasListings = await userHasListings(session.user.id);
        if (hasListings) {
          redirect("/dashboard/vendor");
        } else {
          // Vendor without listings - check if parent dashboard is available as fallback
          if (isParentDashboardEnabled()) {
            redirect("/dashboard/parent");
          } else {
            // No fallback available, redirect to vendor dashboard anyway
            redirect("/dashboard/vendor");
          }
        }
      } else {
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

    case "guest":
    default: {
      redirect("/auth/login");
      break;
    }
  }
}
