import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Admin • Analytics",
  description: "Platform analytics and insights",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/analytics`,
  noIndex: true,
});

export default async function AdminAnalyticsPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/admin/analytics");
  }

  verifyDashboardAccess(user, "admin", "/dashboard/admin/analytics");

  return (
    <AdminDashboardLayout>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Platform Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Analytics dashboard is not yet implemented.
        </p>
      </div>
    </AdminDashboardLayout>
  );
}

