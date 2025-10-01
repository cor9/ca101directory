import { auth } from "@/auth";
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
 * Vendor Dashboard - For users who have listings
 * This is where vendors will manage their listings, view analytics, etc.
 */
export default async function VendorDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Get user's listings
  const allListings = await getPublicListings();
  const userListings = allListings.filter(
    (listing) => listing.owner_id === session.user.id,
  );
  const activeListings = userListings.filter(
    (listing) => listing.Status === "Live" && listing.Active === "checked",
  );

  // Calculate stats
  const totalViews = 0; // TODO: Implement view tracking
  const totalReviews = 0; // TODO: Implement review counting
  const currentPlan = userListings[0]?.Plan || "Free";

  return (
    <VendorDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome, {session.user.name || "Vendor"}!
          </h1>
          <p className="text-muted-foreground">
            Manage your professional listings, track performance, and grow your
            business with Child Actor 101 Directory.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">
              {activeListings.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Listings</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">{totalViews}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">
              {totalReviews}
            </div>
            <div className="text-sm text-muted-foreground">Reviews</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">{currentPlan}</div>
            <div className="text-sm text-muted-foreground">Current Plan</div>
          </div>
        </div>

        {/* My Listings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Listings</h2>
            {userListings.length === 0 && (
              <Button asChild>
                <Link href="/submit">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Listing
                </Link>
              </Button>
            )}
          </div>

          {userListings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <PlusIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No listings yet</h3>
                    <p className="text-muted-foreground">
                      Create your first professional listing to get started
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/submit">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create Your First Listing
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {userListings.map((listing) => (
                <Card key={listing.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {listing["Listing Name"]}
                        </CardTitle>
                        <CardDescription>
                          {listing["What You Offer?"]}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            listing.Status === "Live"
                              ? "default"
                              : listing.Status === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {listing.Status}
                        </Badge>
                        {listing.Plan && (
                          <Badge
                            variant="outline"
                            className={
                              listing.Plan === "Premium"
                                ? "border-brand-orange text-brand-orange"
                                : listing.Plan === "Pro"
                                  ? "border-brand-blue text-brand-blue"
                                  : "border-gray-300 text-gray-600"
                            }
                          >
                            {listing.Plan}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {listing.City && listing.State && (
                          <span>
                            {listing.City}, {listing.State}
                          </span>
                        )}
                        {listing["Approved 101 Badge"] === "checked" && (
                          <div className="flex items-center gap-1">
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                            <span>101 Approved</span>
                          </div>
                        )}
                        {listing.Plan === "Premium" && (
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 text-yellow-500" />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/listing/${
                              listing["Listing Name"]
                                ?.toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/[^a-z0-9-]/g, "") || listing.id
                            }`}
                          >
                            <ExternalLinkIcon className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href="/dashboard/vendor/edit">
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
        {userListings.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Listing Management</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/vendor/edit">
                      <EditIcon className="w-4 h-4 mr-1" />
                      Edit Listing
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/pricing">Upgrade Plan</Link>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Business Tools</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Manage Reviews
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </VendorDashboardLayout>
  );
}
