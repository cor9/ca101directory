import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { siteConfig } from "@/config/site";
import { getAdminListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Admin Dashboard - Child Actor 101 Directory",
  description: "Administrative dashboard for platform management",
  canonicalUrl: `${siteConfig.url}/dashboard/admin`,
});

/**
 * Admin Dashboard - Phase 4.1: Dashboard Redesign & Role Separation
 *
 * This page now acts as a Server Component to fetch initial data
 * and passes it to a Client Component wrapper that handles all state and interactivity.
 */
export default async function AdminDashboard() {
  const user = await currentUser();
  if (!user?.id) {
    redirect("/auth/login");
  }

  // Safety check: Verify user has admin role
  verifyDashboardAccess(user, "admin", "/dashboard/admin");

  const allListings = await getAdminListings();

  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <AdminDashboardClient allListings={allListings} />
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}
