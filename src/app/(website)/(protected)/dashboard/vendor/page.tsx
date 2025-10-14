import { DashboardGuard } from "@/components/auth/role-guard";
import { VendorListingsTable } from "@/components/vendor/vendor-listings-table";
import { siteConfig } from "@/config/site";
import { getVendorListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Vendor Dashboard - Child Actor 101 Directory",
  description: "Manage your business listings and profile.",
  canonicalUrl: `${siteConfig.url}/dashboard/vendor`,
});

/**
 * Vendor Dashboard
 *
 * For vendors only - shows:
 * - Their own listings
 * - Ability to edit their listings
 */
export default async function VendorDashboard() {
  const user = await currentUser();
  if (!user?.id) {
    // This should be caught by the role guard, but as a fallback
    redirect("/login");
  }

  const vendorListings = await getVendorListings(user.id);

  return (
    <DashboardGuard allowedRoles={["vendor"]}>
      {/* Assuming a layout similar to AdminDashboardLayout exists */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Vendor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your listings, view analytics, and grow your business with
              Child Actor 101.
            </p>
          </div>

          {/* My Listings Table */}
          <VendorListingsTable listings={vendorListings} />
        </div>
      </div>
    </DashboardGuard>
  );
}
