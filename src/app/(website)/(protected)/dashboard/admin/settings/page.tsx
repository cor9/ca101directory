import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { siteConfig } from "@/config/site";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Admin • Settings",
  description: "System settings and configuration",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/settings`,
  noIndex: true,
});

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
