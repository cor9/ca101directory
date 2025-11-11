import { AdminCreateForm } from "@/components/admin/admin-create-form";
import { FreeListingCsvUploader } from "@/components/admin/free-listing-csv-uploader";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { siteConfig } from "@/config/site";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Create New Listing - Admin Dashboard",
  description: "Create a new business listing for the directory.",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/create`,
});

export default async function CreateListingPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect(
      `/auth/login?callbackUrl=${encodeURIComponent("/dashboard/admin/create")}`,
    );
  }

  verifyDashboardAccess(user, "admin", "/dashboard/admin/create");

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="bg-card rounded-lg p-6 border">
          <h1 className="text-2xl font-bold text-paper mb-2">Create New Listing</h1>
          <p className="text-paper">
            Fill out the form below to add a new business to the directory.
            You can set the initial status and core details.
          </p>
        </div>

        <div className="bg-card rounded-lg p-6 border space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-paper mb-3">Single Free Listing</h2>
            <p className="text-sm text-paper/80 mb-4">
              Use this form to create one Free plan listing. You can upgrade or edit later.
            </p>
            <AdminCreateForm />
          </div>

          <hr className="border-muted" />

          <div>
            <h2 className="text-xl font-semibold text-paper mb-3">Bulk Upload via CSV</h2>
            <p className="text-sm text-paper/80 mb-4">
              Upload a CSV to create multiple Free plan listings. Accepted headers: name, description, website, email, phone, city, state, zip, region.
            </p>
            <FreeListingCsvUploader />
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
