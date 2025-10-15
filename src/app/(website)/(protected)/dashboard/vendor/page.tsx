import { DashboardGuard } from "@/components/auth/role-guard";
import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { VendorListingsTable } from "@/components/vendor/vendor-listings-table";
import { Button } from "@/components/ui/button";
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
      <VendorDashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-card rounded-lg p-6 border">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-muted-foreground">
              This is your space to manage your listing, view analytics, and access resources to grow your business with us.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h2 className="text-xl font-bold text-foreground mb-4">
                Grow Your Reach
            </h2>
             <p className="text-muted-foreground mb-4">
              Add our official badge to your website to build trust with families and improve your visibility. Access our Backlink Resource Kit for easy-to-use assets.
            </p>
            <Button asChild>
                <a href="/dashboard/vendor/resources">
                    Go to Resource Kit
                </a>
            </Button>
          </div>

          {/* My Listings Table */}
          <VendorListingsTable listings={vendorListings} />
        </div>
      </VendorDashboardLayout>
    </DashboardGuard>
  );
}
