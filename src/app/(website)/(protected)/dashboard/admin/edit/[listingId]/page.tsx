import { AdminEditForm } from "@/components/admin/admin-edit-form";
import { ListingActions } from "@/components/admin/listing-actions";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { getListingById } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

// Force dynamic rendering - don't cache this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = constructMetadata({
  title: "Edit Listing - Admin Dashboard",
  description: "Edit listing details as admin",
});

interface AdminEditPageProps {
  params: {
    listingId: string;
  };
}

/**
 * Admin Edit Listing Page
 * Allows admins to edit any listing regardless of ownership
 */
export default async function AdminEditPage({ params }: AdminEditPageProps) {
  const user = await currentUser();

  if (!user?.id) {
    redirect(
      `/auth/login?callbackUrl=${encodeURIComponent(`/dashboard/admin/edit/${params.listingId}`)}`,
    );
  }

  verifyDashboardAccess(
    user,
    "admin",
    `/dashboard/admin/edit/${params.listingId}`,
  );

  // Get the listing
  console.log("[Admin Edit] Attempting to fetch listing:", params.listingId);

  let listing;
  try {
    listing = await getListingById(params.listingId);
    console.log(
      "[Admin Edit] Listing fetched successfully:",
      listing?.listing_name,
    );
  } catch (error) {
    console.error("[Admin Edit] Error fetching listing:", error);
    throw error;
  }

  if (!listing) {
    console.error("[Admin Edit] Listing not found, returning 404");
    notFound();
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Edit Listing</h1>
            <p className="text-paper">
              Edit details for: {listing.listing_name}
            </p>
          </div>
          <div className="shrink-0">
            {/* Quick actions: Approve/Reject (if pending) and Resend email */}
            <ListingActions
              listingId={listing.id}
              listingName={listing.listing_name || "Unnamed Listing"}
              showApproveReject={listing.status === "Pending"}
            />
          </div>
        </div>

        <AdminEditForm listing={listing} />
      </div>
    </AdminDashboardLayout>
  );
}
