import { auth } from "@/auth";
import { CompedToggle } from "@/components/admin/comped-toggle";
import { ListingActions } from "@/components/admin/listing-actions";
import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getPublicListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import { CheckCircleIcon, EditIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Admin Listings Management - Child Actor 101 Directory",
  description: "Manage and moderate all listings on the platform",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/listings`,
});

/**
 * Admin Listings Management Page
 *
 * Allows admins to:
 * - View all listings
 * - Toggle comped status
 * - Edit listing details
 * - Approve/reject listings
 */
export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?next=/dashboard/admin/listings");
  }

  // Get all listings for admin management
  const allListings = await getPublicListings();
  
  // Filter by status if provided
  const statusFilter = searchParams?.status;
  const filteredListings = statusFilter
    ? allListings.filter((listing) => listing.status === statusFilter)
    : allListings;

  // Sort listings by plan priority and name
  const sortedListings = filteredListings.sort((a, b) => {
    const planPriority = (plan: string | null, comped: boolean | null) => {
      if (comped) return 3; // Comped listings are treated as Pro
      switch (plan) {
        case "premium":
          return 4;
        case "pro":
          return 3;
        case "standard":
          return 2;
        case "free":
          return 1;
        default:
          return 0; // null/undefined plans default to Free
      }
    };

    const aPriority = planPriority(a.plan, a.comped);
    const bPriority = planPriority(b.plan, b.comped);

    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }
    return (a.listing_name || "").localeCompare(b.listing_name || "");
  });

  return (
    <DashboardGuard allowedRoles={["admin"]}>
      <AdminDashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-paper">
                Listings Management
              </h1>
              <p className="text-paper">
                Manage all listings, toggle comped status, and moderate content
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-paper">
                {sortedListings.length} total listings
              </div>
              <Button asChild className="bg-brand-blue hover:bg-brand-blue/90">
                <Link href="/dashboard/admin/create">
                  <EditIcon className="w-4 h-4 mr-2" />
                  Create New Listing
                </Link>
              </Button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <Link
              href="/dashboard/admin/listings"
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                !statusFilter
                  ? "text-brand-blue border-b-2 border-brand-blue"
                  : "text-paper hover:text-paper"
              }`}
            >
              All Listings
              <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {allListings.length}
              </span>
            </Link>
            <Link
              href="/dashboard/admin/listings?status=Pending"
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                statusFilter === "Pending"
                  ? "text-brand-blue border-b-2 border-brand-blue"
                  : "text-paper hover:text-paper"
              }`}
            >
              Pending Review
              <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded-full">
                {allListings.filter((l) => l.status === "Pending").length}
              </span>
            </Link>
            <Link
              href="/dashboard/admin/listings?status=Live"
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                statusFilter === "Live"
                  ? "text-brand-blue border-b-2 border-brand-blue"
                  : "text-paper hover:text-paper"
              }`}
            >
              Live
              <span className="ml-2 text-xs bg-green-100 px-2 py-0.5 rounded-full">
                {allListings.filter((l) => l.status === "Live").length}
              </span>
            </Link>
            <Link
              href="/dashboard/admin/listings?status=Rejected"
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                statusFilter === "Rejected"
                  ? "text-brand-blue border-b-2 border-brand-blue"
                  : "text-paper hover:text-paper"
              }`}
            >
              Rejected
              <span className="ml-2 text-xs bg-red-100 px-2 py-0.5 rounded-full">
                {allListings.filter((l) => l.status === "Rejected").length}
              </span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sortedListings.length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Comped Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {sortedListings.filter((l) => l.comped).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pro/Featured
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {
                    sortedListings.filter(
                      (l) => l.plan === "Pro" || l.plan === "Premium",
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  101 Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {
                    sortedListings.filter((l) => l.is_approved_101 === true)
                      .length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Listings Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-ink truncate">
                          {listing.listing_name || "Untitled Listing"}
                        </h3>
                        <div className="flex items-center gap-2">
                          {/* Plan Badge */}
                          {(() => {
                            // Determine badge text and styling
                            let badgeText = "Free";
                            let badgeClassName =
                              "text-xs bg-gray-100 text-ink";

                            if (listing.comped) {
                              badgeText = "Pro";
                              badgeClassName =
                                "text-xs bg-brand-blue text-white";
                            } else if (listing.plan === "Pro") {
                              badgeText = "Pro";
                              badgeClassName =
                                "text-xs bg-brand-blue text-white";
                            } else if (listing.plan === "Standard") {
                              badgeText = "Standard";
                              badgeClassName =
                                "text-xs bg-gray-100 text-ink";
                            } else if (listing.plan === "Premium") {
                              badgeText = "Featured";
                              badgeClassName =
                                "text-xs bg-brand-orange text-white";
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

                          {/* Comped Badge */}
                          {listing.comped && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-800 text-xs"
                            >
                              Comped
                            </Badge>
                          )}

                          {/* 101 Approved Badge */}
                          {listing.is_approved_101 === true && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 text-xs"
                            >
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              101 Approved
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-paper">
                        <div className="flex items-center gap-4">
                          <span>Email: {listing.email || "N/A"}</span>
                          <span>
                            Location:{" "}
                            {[listing.city, listing.state]
                              .filter(Boolean)
                              .join(", ") || "N/A"}
                          </span>
                          <span>Status: {listing.status || "Unknown"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Approve/Reject Actions for Pending Listings */}
                      {listing.status === "Pending" && (
                        <ListingActions
                          listingId={listing.id}
                          listingName={listing.listing_name || "Unnamed Listing"}
                        />
                      )}

                      {/* Comped Toggle */}
                      <CompedToggle
                        listingId={listing.id}
                        isComped={listing.comped || false}
                        currentPlan={listing.plan}
                      />

                      {/* Edit Button */}
                      <Button size="sm" variant="default" asChild>
                        <Link href={`/dashboard/admin/edit/${listing.id}`}>
                          <EditIcon className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>

                      {/* View Button */}
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/listing/${
                            listing.listing_name
                              ?.toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/[^a-z0-9-]/g, "") || listing.id
                          }`}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}

                {sortedListings.length === 0 && (
                  <div className="text-center py-8 text-paper">
                    No listings found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminDashboardLayout>
    </DashboardGuard>
  );
}
