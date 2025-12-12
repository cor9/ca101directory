import { AdminReviewQueue } from "@/components/admin/admin-review-queue";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
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
  noIndex: true,
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
      user:profiles(id, email)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
  }

  console.log("Reviews fetched:", reviews?.length || 0);
  console.log("Reviews data:", JSON.stringify(reviews, null, 2));

  return (
    <AdminDashboardLayout>
      <AdminReviewQueue reviews={reviews || []} error={error?.message} />
    </AdminDashboardLayout>
  );
}
