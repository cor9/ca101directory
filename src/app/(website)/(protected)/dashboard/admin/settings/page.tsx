import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin • Settings",
};

export default async function AdminSettingsPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/admin/settings");
  }

  verifyDashboardAccess(user, "admin", "/dashboard/admin/settings");

  return (
    <AdminDashboardLayout>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">System Settings</h2>
        <p className="text-sm text-muted-foreground">
          Settings are managed via environment variables and Supabase. A UI is
          planned here.
        </p>
      </div>
    </AdminDashboardLayout>
  );
}

