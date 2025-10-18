import { DashboardGuard } from "@/components/auth/role-guard";
import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { BacklinkResourceKitClient } from "@/components/vendor/backlink-resource-kit-client";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Backlink Resource Kit - Vendor Dashboard",
  description: "Download badges and get resources to link to your Child Actor 101 profile.",
  canonicalUrl: `${siteConfig.url}/dashboard/vendor/resources`,
});

export default function BacklinkKitPage() {
  return (
    <DashboardGuard allowedRoles={["vendor"]}>
      <VendorDashboardLayout>
          <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Backlink Resource Kit
            </h1>
            <p className="text-foreground">
              Link to your Child Actor 101 Directory profile from your website and social media to build trust and improve your SEO.
            </p>
          </div>

          <BacklinkResourceKitClient />
        </div>
      </VendorDashboardLayout>
    </DashboardGuard>
  );
}
