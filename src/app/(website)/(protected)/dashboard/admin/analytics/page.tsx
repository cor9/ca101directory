import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin • Analytics",
};

export default async function AdminAnalyticsPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect(
      `/auth/login?callbackUrl=${encodeURIComponent("/dashboard/admin/analytics")}`,
    );
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

