import { auth } from "@/auth";
import { AdminCreateForm } from "@/components/admin/admin-create-form";
import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { getCategories } from "@/data/categories";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = constructMetadata({
  title: "Create New Listing - Admin Dashboard",
  description: "Create a new listing as admin",
});

/**
 * Admin Create Listing Page
 * Allows admins to create new listings from scratch
 */
export default async function AdminCreatePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?next=/dashboard/admin/create");
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
            <h1 className="text-2xl font-bold">Create New Listing</h1>
            <p className="text-muted-foreground">
              Create a new listing from scratch with full admin control
            </p>
          </div>

          <AdminCreateForm categories={categories} />
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}
