import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";

export const metadata = {
  title: "Admin • Analytics",
};

export default async function AdminAnalyticsPage() {
  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Platform Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Analytics dashboard is not yet implemented.
          </p>
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}

