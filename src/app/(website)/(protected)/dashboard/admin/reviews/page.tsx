import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { AdminReviewQueue } from "@/components/admin/admin-review-queue";
import { siteConfig } from "@/config/site";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Review Queue - Admin Dashboard",
  description: "Moderate and approve user reviews",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/reviews`,
});

export default async function AdminReviewsPage() {
  const user = await currentUser();
  if (!user?.id) {
    redirect("/auth/login");
  }

  // Verify admin access
  verifyDashboardAccess(user, "admin", "/dashboard/admin/reviews");

  // Fetch all reviews with listing and user details
  const supabase = createServerClient();
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      listing:listings(id, listing_name, slug),
      user:profiles(id, name, email)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
  }

  return (
    <AdminDashboardLayout>
      <AdminReviewQueue reviews={reviews || []} />
    </AdminDashboardLayout>
  );
}
