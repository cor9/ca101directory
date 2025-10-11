import { AdminNotifications } from "@/components/admin/admin-notifications";
import { EmailVerificationTool } from "@/components/admin/email-verification-tool";
import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { siteConfig } from "@/config/site";
import { getPublicListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Admin Dashboard - Child Actor 101 Directory",
  description: "Administrative dashboard for platform management",
  canonicalUrl: `${siteConfig.url}/dashboard/admin`,
});

/**
 * Admin Dashboard - Phase 4.1: Dashboard Redesign & Role Separation
 *
 * For administrators only - shows:
 * - Listing moderation
 * - Review moderation
 * - User management
 * - Platform analytics
 */
export default async function AdminDashboard() {
  // Remove server-side auth check - let DashboardGuard handle it
  // This fixes server/client session mismatch issues

  // Get platform data for stats
  const allListings = await getPublicListings();
  const pendingListings = allListings.filter(
    (listing) => listing.status === "Pending",
  );
  const liveListings = allListings.filter(
    (listing) => listing.status === "Live",
  );

  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome, Administrator!
            </h1>
            <p className="text-muted-foreground">
              Manage the platform, moderate content, and oversee all operations
              for Child Actor 101 Directory.
            </p>
          </div>

          {/* Admin Notifications */}
          <AdminNotifications />

          {/* Email Verification Tool */}
          <EmailVerificationTool />

          {/* Platform Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-primary">
                {liveListings.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Listings
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-primary">
                {pendingListings.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Pending Listings
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">
                Pending Reviews
              </div>
            </div>
          </div>

          {/* Moderation Queue */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Moderation Queue</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Listing Moderation</h3>
                <div className="text-sm text-muted-foreground">
                  {pendingListings.length} listings pending approval
                </div>
                <div className="flex gap-2">
                  <a
                    href="/dashboard/admin/listings"
                    className="text-sm text-primary hover:underline"
                  >
                    Review Listings →
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Review Moderation</h3>
                <div className="text-sm text-muted-foreground">
                  0 reviews pending approval
                </div>
                <div className="flex gap-2">
                  <a
                    href="/dashboard/admin/reviews"
                    className="text-sm text-primary hover:underline"
                  >
                    Review Queue →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Content Management</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    •{" "}
                    <a
                      href="/dashboard/admin/create"
                      className="text-primary hover:underline font-medium"
                    >
                      Create new listing
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a
                      href="/dashboard/admin/listings"
                      className="text-primary hover:underline"
                    >
                      Approve/reject listings
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a
                      href="/dashboard/admin/reviews"
                      className="text-primary hover:underline"
                    >
                      Moderate reviews
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a
                      href="/dashboard/admin/suggestions"
                      className="text-primary hover:underline"
                    >
                      Review vendor suggestions
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Platform Management</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    •{" "}
                    <a
                      href="/dashboard/admin/users"
                      className="text-primary hover:underline"
                    >
                      Manage users
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a
                      href="/dashboard/admin/analytics"
                      className="text-primary hover:underline"
                    >
                      View analytics
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a
                      href="/dashboard/admin/settings"
                      className="text-primary hover:underline"
                    >
                      System settings
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}
