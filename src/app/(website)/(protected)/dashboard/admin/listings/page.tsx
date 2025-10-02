import { auth } from "@/auth";
import { DashboardGuard } from "@/components/auth/role-guard";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { CompedToggle } from "@/components/admin/comped-toggle";
import { siteConfig } from "@/config/site";
import { getPublicListings } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon, EditIcon, StarIcon } from "lucide-react";
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
export default async function AdminListingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?next=/dashboard/admin/listings");
  }

  // Get all listings for admin management
  const allListings = await getPublicListings();
  
  // Sort listings by plan priority and name
  const sortedListings = allListings.sort((a, b) => {
    const planPriority = (plan: string | null) => {
      switch (plan) {
        case "Premium": return 4;
        case "Pro": return 3;
        case "Basic": return 2;
        case "Free": return 1;
        default: return 0;
      }
    };

    const aPriority = planPriority(a.plan);
    const bPriority = planPriority(b.plan);

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
              <h1 className="text-2xl font-bold text-foreground">Listings Management</h1>
              <p className="text-muted-foreground">
                Manage all listings, toggle comped status, and moderate content
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {sortedListings.length} total listings
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sortedListings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Comped Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {sortedListings.filter(l => l.comped).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pro/Featured</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {sortedListings.filter(l => l.plan === "Pro" || l.plan === "Premium").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">101 Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {sortedListings.filter(l => l.approved_101_badge === "checked").length}
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
                        <h3 className="font-semibold text-foreground truncate">
                          {listing.listing_name || "Untitled Listing"}
                        </h3>
                        <div className="flex items-center gap-2">
                          {/* Plan Badge */}
                          {listing.plan && (
                            <Badge
                              variant={listing.plan === "Premium" ? "default" : "outline"}
                              className={`
                                text-xs
                                ${listing.plan === "Premium" ? "bg-brand-orange text-white" : ""}
                                ${listing.plan === "Pro" ? "bg-brand-blue text-white" : ""}
                                ${listing.plan === "Basic" ? "bg-gray-100 text-gray-800" : ""}
                                ${listing.plan === "Free" ? "bg-gray-100 text-gray-600" : ""}
                              `}
                            >
                              {listing.plan}
                            </Badge>
                          )}
                          
                          {/* Comped Badge */}
                          {listing.comped && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                              Comped
                            </Badge>
                          )}
                          
                          {/* 101 Approved Badge */}
                          {listing.approved_101_badge === "checked" && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              101 Approved
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>Email: {listing.email || "N/A"}</span>
                          <span>Location: {[listing.city, listing.state].filter(Boolean).join(", ") || "N/A"}</span>
                          <span>Status: {listing.status || "Unknown"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Comped Toggle */}
                      <CompedToggle 
                        listingId={listing.id}
                        isComped={listing.comped || false}
                        currentPlan={listing.plan}
                      />
                      
                      {/* Edit Button */}
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/listing/${listing.listing_name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || listing.id}`}>
                          <EditIcon className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                
                {sortedListings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
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
