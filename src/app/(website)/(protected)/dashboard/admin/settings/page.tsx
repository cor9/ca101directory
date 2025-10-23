import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";

export const metadata = {
  title: "Admin • Settings",
};

export default async function AdminSettingsPage() {
  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">System Settings</h2>
          <p className="text-sm text-muted-foreground">
            Settings are managed via environment variables and Supabase. A UI is
            planned here.
          </p>
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}

