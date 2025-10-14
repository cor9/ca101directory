import { DashboardGuard } from "@/components/auth/role-guard";
import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { ClaimListingClient } from "@/components/vendor/claim-listing-client";
import { siteConfig } from "@/config/site";
import { getUnclaimedListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Claim Your Listing - Child Actor 101 Directory",
  description: "Find and claim your business listing on our directory.",
  canonicalUrl: `${siteConfig.url}/dashboard/vendor/claim`,
});

export default async function ClaimListingPage() {
  const unclaimedListings = await getUnclaimedListings();

  return (
    <DashboardGuard allowedRoles={["vendor"]}>
      <VendorDashboardLayout>
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Claim Your Business Listing
            </h1>
            <p className="text-muted-foreground">
              Find your business in the list below to claim it and manage your
              profile. If you can't find your business, you may need to{" "}
              <a
                href="/list-your-business"
                className="text-primary hover:underline"
              >
                create a new listing
              </a>
              .
            </p>
          </div>

          <ClaimListingClient listings={unclaimedListings || []} />
        </div>
      </VendorDashboardLayout>
    </DashboardGuard>
  );
}
