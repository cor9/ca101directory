import { getCrmListings } from "@/actions/crm";
import { CrmTable } from "@/components/admin/crm-table";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Admin • CRM Outreach",
  description: "Manage vendor outreach and upgrade pipeline.",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/crm`,
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AdminCrmPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/admin/crm");
  }

  verifyDashboardAccess(user, "admin", "/dashboard/admin/crm");

  // Note: ensure supabase migration 20260324_vendor_crm.sql has been run
  const listings = await getCrmListings();

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Vendor Outreach CRM
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage your communication with high-performing free vendors.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <CrmTable initialListings={listings as any[]} />
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
