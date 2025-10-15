import { AdminCreateForm } from "@/components/admin/admin-create-form";
import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Create New Listing - Admin Dashboard",
  description: "Create a new business listing for the directory.",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/create`,
});

export default function CreateListingPage() {
  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Create New Listing
            </h1>
            <p className="text-muted-foreground">
              Fill out the form below to add a new business to the directory.
              You can set the initial status and core details.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <AdminCreateForm />
          </div>
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}