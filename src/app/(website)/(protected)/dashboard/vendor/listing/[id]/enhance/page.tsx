import { auth } from "@/auth";
import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { VendorEditForm } from "@/components/vendor/vendor-edit-form";
import { getListingById } from "@/data/listings";
import { notFound, redirect } from "next/navigation";

export default async function EnhanceListingPage({
  params,
  searchParams,
}: { params: { id: string }; searchParams: { upgraded?: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/auth/login?callbackUrl=/dashboard/vendor/listing/${params.id}/enhance`,
    );
  }

  const listing = await getListingById(params.id).catch(() => null);
  if (!listing) return notFound();

  return (
    <DashboardGuard allowedRoles={["vendor", "admin"]}>
      <AdminDashboardLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <p className="bauhaus-body text-paper text-sm opacity-80">
              Step 2 of 3
            </p>
            <h1 className="bauhaus-heading text-3xl text-paper">
              Enhance “{listing.listing_name}”
            </h1>
            <p className="bauhaus-body text-paper mt-2">
              {searchParams.upgraded ? "Upgrade successful! " : ""}
              Add your logo, gallery images, and richer details unlocked by your
              plan. You can save and finish later, or submit for review when
              ready.
            </p>
            {/* 18G: The One Sentence */}
            {!searchParams.upgraded && (
              <p className="text-xs text-paper/70 mt-2 italic">
                Providers with Pro features receive 3–5× more parent contact.
              </p>
            )}
          </div>

          {/* Reuse vendor edit form for now; it respects fields and validation */}
          <div className="bg-card rounded-lg p-6 border">
            <VendorEditForm
              listing={listing as any}
              redirectUrl={`/dashboard/vendor?lid=${listing.id}`}
            />
          </div>
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}
