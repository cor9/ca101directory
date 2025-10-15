import { auth } from "@/auth";
import { ReviewActions } from "@/components/admin/review-actions";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminDashboardEnabled } from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getPendingReviews, updateReviewStatus } from "@/data/reviews";
import { isAdmin } from "@/lib/auth/roles";
import { constructMetadata } from "@/lib/metadata";
import { CheckCircle, Star, XCircle } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Review Moderation - Admin Dashboard",
  description: "Moderate and approve/reject user reviews",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/reviews`,
});

export default async function AdminReviewsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Check if user is admin
  if (!isAdmin(session.user as any)) {
    redirect("/dashboard");
  }

  // Check if admin dashboard is enabled
  if (!isAdminDashboardEnabled()) {
    redirect("/dashboard");
  }

  // Fetch pending reviews
  const pendingReviews = await getPendingReviews();

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Review Moderation</h1>
            <p className="text-gray-900">
              Review and moderate user-submitted reviews
            </p>
          </div>
          <Badge variant="secondary">
            {pendingReviews.length} pending review
            {pendingReviews.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {pendingReviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-gray-900 text-center">
                There are no pending reviews to moderate at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {review.listing?.["Listing Name"] || "Unknown Listing"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.stars
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-900"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-900">
                          by{" "}
                          {review.user?.name ||
                            review.user?.email ||
                            "Anonymous"}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline">{review.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Review Text</h4>
                      <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded">
                        {review.text}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(review.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Listing ID:</span>
                        <span className="ml-2 text-gray-900 font-mono">
                          {review.listing_id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t">
                      <ReviewActions reviewId={review.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
