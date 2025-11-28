import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Admin • Vendor Suggestions",
  description: "Manage vendor suggestions from users",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/suggestions`,
  noIndex: true,
});

export default async function AdminSuggestionsPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/admin/suggestions");
  }

  verifyDashboardAccess(user, "admin", "/dashboard/admin/suggestions");

  return (
    <AdminDashboardLayout>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Vendor Suggestions</h2>
        <p className="text-sm text-muted-foreground">
          Moderation UI is coming soon. Track suggestions in Supabase table
          <code className="ml-1">vendor_suggestions</code>.
        </p>
      </div>
    </AdminDashboardLayout>
  );
}

