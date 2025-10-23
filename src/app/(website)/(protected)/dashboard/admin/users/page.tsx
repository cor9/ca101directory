import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";

export const metadata = {
  title: "Admin • Users",
};

export default async function AdminUsersPage() {
  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">All Users</h2>
          <p className="text-sm text-muted-foreground">
            User management tools are coming soon. For now, use Supabase to
            manage user roles and accounts.
          </p>
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}

