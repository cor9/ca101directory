import { AdminDashboardClientNew } from "@/components/admin/admin-dashboard-client-new";
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
  noIndex: true,
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
  const totalListings = allListings.length;

  // Fetch REAL user data from profiles table
  const supabase = createServerClient();
  const { data: users, error: profilesError } = await supabase
    .from("profiles")
    .select("id, role")
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error(
      "Failed to load profiles for admin dashboard:",
      profilesError,
    );
  }

  const { count: totalReviewsCount, error: reviewsCountError } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true });

  if (reviewsCountError) {
    console.error(
      "Failed to load review count for admin dashboard:",
      reviewsCountError,
    );
  }

  const { count: pendingReviewsCount, error: pendingReviewsError } =
    await supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

  if (pendingReviewsError) {
    console.error(
      "Failed to load pending review count for admin dashboard:",
      pendingReviewsError,
    );
  }

  const totalUsers = users?.length || 0;
  const totalVendors = users?.filter((u) => u.role === "vendor").length || 0;
  const totalAdmins = users?.filter((u) => u.role === "admin").length || 0;

  return (
    <AdminDashboardLayout>
      <AdminDashboardClientNew
        allListings={allListings}
        totalUsers={totalUsers}
        totalVendors={totalVendors}
        totalAdmins={totalAdmins}
        totalListings={totalListings}
        totalReviews={totalReviewsCount ?? 0}
        pendingReviews={pendingReviewsCount ?? 0}
      />
    </AdminDashboardLayout>
  );
}
