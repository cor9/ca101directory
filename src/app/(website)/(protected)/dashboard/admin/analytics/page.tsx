import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import {
  getAnalyticsSummary,
  getListingsGrowth,
  getUsersGrowth,
  getReviewsGrowth,
  getListingsByPlan,
  getListingsByStatus,
  getReviewRatingDistribution,
  getUsersByRole,
  getTopCategories,
} from "@/data/analytics";
import {
  GrowthLineChart,
  DistributionBarChart,
  DistributionPieChart,
  StatCard,
} from "@/components/analytics/analytics-charts";
import { HotLeadsTable } from "@/components/admin/hot-leads-table";
import {
  TrendingUp,
  Users,
  FileText,
  Star,
  Target,
  DollarSign,
} from "lucide-react";

export const metadata = constructMetadata({
  title: "Admin • Analytics",
  description: "Platform analytics and insights",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/analytics`,
  noIndex: true,
});

// Force dynamic rendering to show real-time analytics
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/admin/analytics");
  }

  verifyDashboardAccess(user, "admin", "/dashboard/admin/analytics");

  // Fetch all analytics data in parallel
  const [
    summary,
    listingsGrowth,
    usersGrowth,
    reviewsGrowth,
    listingsByPlan,
    listingsByStatus,
    reviewRatings,
    usersByRole,
    topCategories,
  ] = await Promise.all([
    getAnalyticsSummary(),
    getListingsGrowth(30),
    getUsersGrowth(30),
    getReviewsGrowth(30),
    getListingsByPlan(),
    getListingsByStatus(),
    getReviewRatingDistribution(),
    getUsersByRole(),
    getTopCategories(10),
  ]);

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Platform Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into platform growth, engagement, and
            performance
          </p>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Listings"
            value={summary.totalListings.toLocaleString()}
            subtitle="Active and pending listings"
            icon={<FileText className="h-4 w-4" />}
          />
          <StatCard
            title="Total Users"
            value={summary.totalUsers.toLocaleString()}
            subtitle="Parents, vendors, and admins"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Total Reviews"
            value={summary.totalReviews.toLocaleString()}
            subtitle={`Average ${summary.avgRating} stars`}
            icon={<Star className="h-4 w-4" />}
          />
          <StatCard
            title="Claim Rate"
            value={`${summary.claimRate}%`}
            subtitle="Listings claimed by vendors"
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard
            title="Paid Conversion"
            value={`${summary.paidListingsRate}%`}
            subtitle="Free → paid upgrade rate"
            trend="up"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            title="Total Favorites"
            value={summary.totalFavorites.toLocaleString()}
            subtitle="User engagement metric"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>

        {/* Growth Trends */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Growth Trends (Last 30 Days)
          </h2>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <GrowthLineChart
              data={listingsGrowth}
              title="Listings Created"
              color="#FF6B35"
            />
            <GrowthLineChart
              data={usersGrowth}
              title="New Users Registered"
              color="#004E89"
            />
            <GrowthLineChart
              data={reviewsGrowth}
              title="Reviews Submitted"
              color="#F7C548"
            />
            <div className="flex items-center justify-center bg-card border border-border rounded-lg p-8">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-primary-orange mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Platform Growth
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Track daily growth across listings, users, and reviews to
                  monitor platform health and engagement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Distribution Charts */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Distribution Analysis
          </h2>
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <DistributionPieChart
              data={listingsByPlan}
              title="Listings by Plan"
            />
            <DistributionPieChart
              data={listingsByStatus}
              title="Listings by Status"
            />
            <DistributionPieChart data={usersByRole} title="Users by Role" />
            <DistributionBarChart
              data={reviewRatings}
              title="Review Ratings Distribution"
              color="#F7C548"
            />
          </div>
        </div>

        {/* Top Categories */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Popular Categories
          </h2>
          <DistributionBarChart
            data={topCategories}
            title="Top 10 Categories by Listing Count"
            color="#FF6B35"
          />
        </div>

        {/* Hot Leads - Revenue Opportunities */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            🎯 Revenue Opportunities
          </h2>
          <HotLeadsTable />
        </div>

        {/* Footer Note */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            📊 About These Analytics
          </h3>
          <p className="text-xs text-muted-foreground">
            All metrics are calculated in real-time from your production
            database. Growth trends show the last 30 days of activity.
            Distribution charts reflect current platform status. Data is
            refreshed on each page load.
          </p>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
