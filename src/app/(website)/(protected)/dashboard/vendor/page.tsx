import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { Button } from "@/components/ui/button";
import { VendorListingsTable } from "@/components/vendor/vendor-listings-table";
import { VendorROIStats } from "@/components/vendor/vendor-roi-stats";
import { siteConfig } from "@/config/site";
import { getVendorListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Vendor Dashboard - Child Actor 101 Directory",
  description: "Manage your business listings and profile.",
  canonicalUrl: `${siteConfig.url}/dashboard/vendor`,
  noIndex: true,
});

/**
 * Vendor Dashboard
 *
 * For vendors only - shows:
 * - Their own listings
 * - Ability to edit their listings
 *
 * Note: verifyDashboardAccess() is the ONLY security check needed.
 * Removed DashboardGuard to prevent redirect loops caused by client/server role detection mismatches.
 */
export default async function VendorDashboard({ searchParams }: { searchParams?: { lid?: string; claimed?: string; upgraded?: string; onboard?: string } }) {
  const user = await currentUser();
  if (!user?.id) {
    redirect("/auth/login");
  }

  // Safety check: Verify user has vendor role (SERVER-SIDE ONLY)
  // This is sufficient - no need for client-side guard that can cause loops
  verifyDashboardAccess(user, "vendor", "/dashboard/vendor");

  const vendorListings = await getVendorListings(user.id);
  const onboardingLid = searchParams?.lid || (vendorListings[0]?.id ?? "");
  const showOnboarding = Boolean(searchParams?.claimed || searchParams?.upgraded || searchParams?.onboard);

  return (
    <VendorDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        {showOnboarding && onboardingLid && (
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="bauhaus-heading text-2xl text-foreground mb-1">Welcome! Enhance your listing</h2>
            <p className="bauhaus-body text-foreground mb-4">Add your logo, gallery, and detailed information to make a great first impression.</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href={`/dashboard/vendor/listing/${onboardingLid}/enhance?onboard=1`}>Enhance Now</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard/vendor">Finish Later</a>
              </Button>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg p-6 border">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-foreground">
            This is your space to manage your listing, view analytics, and
            access resources to grow your business with us.
          </p>
        </div>

        {/* ROI Stats Widget */}
        <VendorROIStats vendorId={user.id} />

        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Grow Your Reach
          </h2>
          <p className="text-foreground mb-4">
            Add our official badge to your website to build trust with
            families and improve your visibility. Access our Backlink Resource
            Kit for easy-to-use assets.
          </p>
          <Button asChild>
            <a href="/dashboard/vendor/resources">Go to Resource Kit</a>
          </Button>
        </div>

        {/* My Listings Table */}
        <VendorListingsTable listings={vendorListings} />
      </div>
    </VendorDashboardLayout>
  );
}
