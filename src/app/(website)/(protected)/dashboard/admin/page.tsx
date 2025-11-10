import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { siteConfig } from "@/config/site";
import { getAdminListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Admin Dashboard - Child Actor 101 Directory",
  description: "Administrative dashboard for platform management",
  canonicalUrl: `${siteConfig.url}/dashboard/admin`,
});

/**
 * Admin Dashboard - Rebuilt November 2, 2025
 *
 * Clean, functional dashboard showing REAL data:
 * - Actual user counts from profiles table
 * - Listing stats with working filters
 * - Only features that actually exist
 *
 * Note: verifyDashboardAccess() is the ONLY security check needed.
 */
export default async function AdminDashboard() {
  const user = await currentUser();
  if (!user?.id) {
    redirect("/auth/login");
  }

  // Safety check: Verify user has admin role (SERVER-SIDE ONLY)
  verifyDashboardAccess(user, "admin", "/dashboard/admin");

  // Fetch listings
  const allListings = await getAdminListings();

  // Fetch platform metrics server-side
  const supabase = createServerClient();
  const [profilesResult, listingsResult, reviewsResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("listings").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
  ]);

  if (profilesResult.error) {
    console.error("Failed to fetch profiles count", profilesResult.error);
  }

  if (listingsResult.error) {
    console.error("Failed to fetch listings count", listingsResult.error);
  }

  if (reviewsResult.error) {
    console.error("Failed to fetch reviews count", reviewsResult.error);
  }

  const metrics = {
    totalProfiles: profilesResult.count ?? 0,
    totalListings: listingsResult.count ?? allListings.length,
    totalReviews: reviewsResult.count ?? 0,
  };

  return (
    <AdminDashboardLayout>
      <AdminDashboardClient allListings={allListings} metrics={metrics} />
    </AdminDashboardLayout>
  );
}
