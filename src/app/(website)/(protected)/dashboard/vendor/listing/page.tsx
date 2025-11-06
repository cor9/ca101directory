import { auth } from "@/auth";
import { DashboardGuard } from "@/components/auth/role-guard";
import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserListings } from "@/lib/api/listings";
import { Edit, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function VendorListingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch user's listings
  const userListings = await fetchUserListings(session.user.id);

  return (
    <DashboardGuard allowedRoles={["vendor"]}>
      <VendorDashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="bauhaus-heading text-3xl">My Listings</h1>
              <p className="bauhaus-body text-foreground">
                Manage your professional listings and content
              </p>
            </div>
            <Button asChild className="bauhaus-btn-primary">
              <Link href="/submit">
                <Edit className="mr-2 h-4 w-4" />
                CREATE NEW LISTING
              </Link>
            </Button>
          </div>

          {/* Listings Grid */}
          {userListings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <h3 className="bauhaus-heading text-xl">No listings yet</h3>
                  <p className="bauhaus-body text-foreground max-w-md">
                    Create your first professional listing to start connecting
                    with families
                  </p>
                  <Button asChild className="bauhaus-btn-primary">
                    <Link href="/submit">CREATE YOUR FIRST LISTING</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bauhaus-grid bauhaus-grid-2 gap-6">
              {userListings.map((listing) => (
                <Card key={listing.id} className="bauhaus-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="bauhaus-heading text-xl mb-2">
                          {listing.listing_name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mb-3">
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
                            let badgeText = "Free";
                            let badgeClassName =
                              "border-gray-300 text-foreground";

                            const planLower = (listing.plan || "").toLowerCase();

                            if (listing.comped) {
                              badgeText = "Pro";
                              badgeClassName =
                                "border-blue-500 text-blue-600 bg-blue-50";
                            } else if (planLower === "pro" || planLower === "founding pro") {
                              badgeText = listing.plan || "Pro";
                              badgeClassName =
                                "border-blue-500 text-blue-600 bg-blue-50";
                            } else if (planLower === "standard" || planLower === "founding standard") {
                              badgeText = listing.plan || "Standard";
                              badgeClassName =
                                "border-gray-500 text-foreground bg-gray-50";
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
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bauhaus-body text-sm text-foreground line-clamp-2">
                      {(listing.what_you_offer || "")
                        .replace(/<[^>]*>/g, " ")
                        .replace(/\s+/g, " ")
                        .trim()}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/listing/${listing.slug || listing.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          VIEW
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link
                          href={`/submit?claim=true&listingId=${listing.id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          EDIT
                        </Link>
                      </Button>
                      {listing.website && (
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={listing.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            WEBSITE
                          </Link>
                        </Button>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="pt-3 border-t grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-foreground">Created:</span>
                        <div className="font-medium">
                          {listing.created_at
                            ? new Date(listing.created_at).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="text-foreground">Updated:</span>
                        <div className="font-medium">
                          {listing.updated_at
                            ? new Date(listing.updated_at).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </VendorDashboardLayout>
    </DashboardGuard>
  );
}
