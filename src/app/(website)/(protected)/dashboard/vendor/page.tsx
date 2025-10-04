import { auth } from "@/auth";
import { DashboardGuard } from "@/components/auth/role-guard";
import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getPublicListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import {
  CheckCircleIcon,
  EditIcon,
  ExternalLinkIcon,
  PlusIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Vendor Dashboard - Child Actor 101 Directory",
  description: "Manage your professional listings and vendor account",
  canonicalUrl: `${siteConfig.url}/dashboard/vendor`,
});

/**
 * Vendor Dashboard - Phase 4.1: Dashboard Redesign & Role Separation
 *
 * For vendors only - shows:
 * - My Listings (status, plan tier)
 * - Stats (views, reviews count)
 * - Quick actions: "Submit New Listing," "Edit Listing," "Upgrade Plan"
 *
 * NO favorites/review history - vendors only see reviews on their listings
 */
export default async function VendorDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?next=/dashboard/vendor");
  }

  // Get user's listings
  const allListings = await getPublicListings();
  const userListings = allListings.filter(
    (listing) => listing.owner_id === session.user.id,
  );
  const activeListings = userListings.filter(
    (listing) => listing.status === "Live" && listing.is_active === true,
  );

  // Calculate stats
  const totalViews = 0; // TODO: Implement view tracking
  const totalReviews = 0; // TODO: Implement review counting

  // Determine current plan - prioritize comped, then highest paid plan
  let currentPlan = "Free";
  const isComped = userListings.some((listing) => listing.comped);

  if (isComped) {
    currentPlan = "Pro (Comped)";
  } else {
    const plans = userListings.map((listing) => listing.plan).filter(Boolean);
    if (plans.includes("pro")) {
      currentPlan = "Pro";
    } else if (plans.includes("standard")) {
      currentPlan = "Standard";
    } else if (plans.includes("premium")) {
      currentPlan = "Premium";
    }
  }

  return (
    <DashboardGuard allowedRoles={["vendor"]}>
      <VendorDashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-orange/20 to-secondary-denim/20 rounded-lg p-6 border border-primary-orange/30">
            <h1 className="text-2xl font-bold text-paper mb-2">
              Welcome, {session.user.name || "Vendor"}!
            </h1>
            <p className="text-paper/80">
              Manage your professional listings, track performance, and grow
              your business with Child Actor 101 Directory.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-surface rounded-lg p-4 border border-surface/20">
              <div className="text-2xl font-bold text-primary-orange">
                {activeListings.length}
              </div>
              <div className="text-sm" style={{ color: "#333" }}>Active Listings</div>
            </div>
            <div className="bg-surface rounded-lg p-4 border border-surface/20">
              <div className="text-2xl font-bold text-primary-orange">
                {totalViews}
              </div>
              <div className="text-sm" style={{ color: "#333" }}>Total Views</div>
            </div>
            <div className="bg-surface rounded-lg p-4 border border-surface/20">
              <div className="text-2xl font-bold text-primary-orange">
                {totalReviews}
              </div>
              <div className="text-sm" style={{ color: "#333" }}>Reviews</div>
            </div>
            <div className="bg-surface rounded-lg p-4 border border-surface/20">
              <div className="text-2xl font-bold text-primary-orange">
                {currentPlan}
              </div>
              <div className="text-sm" style={{ color: "#333" }}>
                Current Plan
                {isComped && (
                  <span className="ml-2 text-xs bg-highlight/20 text-highlight px-2 py-1 rounded-full">
                    Comped
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* My Listings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-paper">My Listings</h2>
              {userListings.length === 0 && (
                <Button asChild className="btn-primary">
                  <Link href="/submit">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Submit New Listing
                  </Link>
                </Button>
              )}
            </div>

            {userListings.length === 0 ? (
              <Card className="bg-surface border-surface/20">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-secondary-denim/20 rounded-full flex items-center justify-center mx-auto">
                      <PlusIcon className="w-8 h-8 text-secondary-denim" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: "#1F2327" }}>
                        No listings yet
                      </h3>
                      <p style={{ color: "#333" }}>
                        Submit your first professional listing to get started
                      </p>
                    </div>
                    <Button asChild className="btn-primary">
                      <Link href="/submit">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Submit Your First Listing
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userListings.map((listing) => (
                  <Card
                    key={listing.id}
                    className="bg-surface border-surface/20"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg" style={{ color: "#1F2327" }}>
                            {listing.listing_name}
                          </CardTitle>
                          <CardDescription style={{ color: "#333" }}>
                            {listing.what_you_offer}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              listing.status === "Live"
                                ? "default"
                                : listing.status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {listing.status}
                          </Badge>
                          {(() => {
                            // Determine badge text and styling - match dashboard logic
                            let badgeText = "Free";
                            let badgeClassName =
                              "border-gray-300 text-gray-600";

                            if (listing.comped) {
                              badgeText = "Pro";
                              badgeClassName =
                                "border-blue-500 text-blue-600 bg-blue-50";
                            } else if (listing.plan === "pro") {
                              badgeText = "Pro";
                              badgeClassName =
                                "border-blue-500 text-blue-600 bg-blue-50";
                            } else if (listing.plan === "standard") {
                              badgeText = "Standard";
                              badgeClassName =
                                "border-gray-500 text-gray-600 bg-gray-50";
                            } else if (listing.plan === "premium") {
                              badgeText = "Premium";
                              badgeClassName =
                                "border-orange-500 text-orange-600 bg-orange-50";
                            }

                            return (
                              <Badge
                                variant="outline"
                                className={badgeClassName}
                              >
                                {badgeText}
                              </Badge>
                            );
                          })()}
                          {listing.comped && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-800 text-xs"
                            >
                              Comped
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm" style={{ color: "#666" }}>
                          {listing.city && listing.state && (
                            <span>
                              {listing.city}, {listing.state}
                            </span>
                          )}
                          {listing.is_approved_101 === true && (
                            <div className="flex items-center gap-1">
                              <CheckCircleIcon className="w-4 h-4 text-success" />
                              <span>101 Approved</span>
                            </div>
                          )}
                          {listing.plan === "Premium" && (
                            <div className="flex items-center gap-1">
                              <StarIcon className="w-4 h-4 text-highlight" />
                              <span>Featured</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="btn-secondary"
                          >
                            <Link href={`/listing/${listing.id}`}>
                              <ExternalLinkIcon className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button size="sm" asChild className="btn-primary">
                            <Link href={`/edit/${listing.id}`}>
                              <EditIcon className="w-4 h-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-surface/50 rounded-lg p-6 border border-surface/20">
            <h2 className="text-lg font-semibold mb-4 text-surface">
              Quick Actions
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium" style={{ color: "#1F2327" }}>Listing Management</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="btn-secondary"
                  >
                    <Link href="/submit">
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Submit New Listing
                    </Link>
                  </Button>
                  {userListings.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="btn-secondary"
                    >
                      <Link href={`/edit/${userListings[0]?.id}`}>
                        <EditIcon className="w-4 h-4 mr-1" />
                        Edit Listing
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium" style={{ color: "#1F2327" }}>Business Growth</h3>
                <div className="flex gap-2">
                  {isComped ? (
                    <div className="text-sm" style={{ color: "#666" }}>
                      Your plan is comped by admin
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="btn-secondary"
                    >
                      <Link href="/pricing">Upgrade Plan</Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="btn-secondary"
                  >
                    View Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VendorDashboardLayout>
    </DashboardGuard>
  );
}
