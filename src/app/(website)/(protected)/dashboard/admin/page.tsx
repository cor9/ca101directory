import { auth } from "@/auth";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { siteConfig } from "@/config/site";
import { isAdmin } from "@/lib/auth/roles";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Admin Dashboard - Child Actor 101 Directory",
  description: "Administrative dashboard for platform management",
  canonicalUrl: `${siteConfig.url}/dashboard/admin`,
});

/**
 * Admin Dashboard - For administrators
 * This is where admins can manage the platform, moderate content, etc.
 */
export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user is admin
  if (!isAdmin(session.user as any)) {
    redirect("/dashboard");
  }

  return (
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

        {/* Platform Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Active Listings</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Pending Reviews</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">
              Vendor Suggestions
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Coming Soon Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">User Management</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• User account management</li>
                <li>• Role assignment and permissions</li>
                <li>• User activity monitoring</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Content Moderation</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Listing approval workflow</li>
                <li>• Review moderation queue</li>
                <li>• Content flagging system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
