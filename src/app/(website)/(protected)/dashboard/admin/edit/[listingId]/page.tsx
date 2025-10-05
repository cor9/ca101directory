import { auth } from "@/auth";
import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { AdminEditForm } from "@/components/admin/admin-edit-form";
import { getListingById } from "@/data/listings";
import { getCategories } from "@/data/categories";
import { constructMetadata } from "@/lib/metadata";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

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
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?next=/dashboard/admin/edit/" + params.listingId);
  }

  // Get the listing
  const listing = await getListingById(params.listingId);

  if (!listing) {
    notFound();
  }

  // Get categories for the form
  let categories: Array<{ id: string; name: string }> = [];
  try {
    const rawCategories = await getCategories();
    categories = rawCategories
      .filter((cat) => cat.category_name)
      .map((cat) => ({
        id: cat.id,
        name: cat.category_name,
      }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Continue with empty categories array
  }

  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Edit Listing</h1>
            <p className="text-muted-foreground">
              Edit details for: {listing.listing_name}
            </p>
          </div>

          <AdminEditForm listing={listing} categories={categories} />
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}
