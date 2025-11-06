import { auth } from "@/auth";
import { ParentDashboardLayout } from "@/components/layouts/ParentDashboardLayout";
import {
  isParentDashboardEnabled,
  isReviewsEnabled,
} from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getUserReviews } from "@/data/reviews";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "My Reviews - Parent Dashboard",
  description: "View and manage your submitted reviews",
  canonicalUrl: `${siteConfig.url}/dashboard/parent/reviews`,
});

/**
 * Parent Reviews Page
 *
 * Shows all reviews submitted by the parent user
 * with status indicators (pending, approved, rejected)
 */
export default async function ParentReviewsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/dashboard/parent/reviews");
  }

  // Check if parent dashboard and reviews are enabled
  if (!isParentDashboardEnabled() || !isReviewsEnabled()) {
    redirect("/dashboard/parent");
  }

  // Verify user has parent role
  verifyDashboardAccess(session.user as any, "parent", "/dashboard/parent/reviews");

  // Fetch user's reviews
  const reviews = await getUserReviews(session.user.id);

  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Group reviews by status
  const approvedReviews = sortedReviews.filter((r) => r.status === "approved");
  const pendingReviews = sortedReviews.filter((r) => r.status === "pending");
  const rejectedReviews = sortedReviews.filter((r) => r.status === "rejected");

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-orange/10 to-secondary-denim/10 rounded-lg p-6 border border-primary-orange/20">
          <h1 className="text-2xl font-bold text-paper mb-2">
            My Reviews
          </h1>
          <p className="text-paper/90">
            Track the status of your submitted reviews and help other parents
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-surface rounded-lg p-4 border border-surface/20">
            <div className="text-2xl font-bold text-green-500">
              {approvedReviews.length}
            </div>
            <div className="text-paper">Published Reviews</div>
          </div>
          <div className="bg-surface rounded-lg p-4 border border-surface/20">
            <div className="text-2xl font-bold text-yellow-500">
              {pendingReviews.length}
            </div>
            <div className="text-paper">Pending Approval</div>
          </div>
          <div className="bg-surface rounded-lg p-4 border border-surface/20">
            <div className="text-2xl font-bold text-primary-orange">
              {reviews.length}
            </div>
            <div className="text-paper">Total Reviews</div>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {/* Pending Reviews */}
            {pendingReviews.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-paper flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Pending Approval ({pendingReviews.length})
                </h2>
                <div className="space-y-3">
                  {pendingReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} status="pending" />
                  ))}
                </div>
              </div>
            )}

            {/* Approved Reviews */}
            {approvedReviews.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-paper flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Published ({approvedReviews.length})
                </h2>
                <div className="space-y-3">
                  {approvedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} status="approved" />
                  ))}
                </div>
              </div>
            )}

            {/* Rejected Reviews */}
            {rejectedReviews.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-paper flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Not Published ({rejectedReviews.length})
                </h2>
                <div className="space-y-3">
                  {rejectedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} status="rejected" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-surface/20 rounded-lg p-12 text-center border border-surface/20">
            <div className="text-6xl mb-4">✍️</div>
            <h2 className="text-xl font-semibold mb-2 text-ink">
              No Reviews Yet
            </h2>
            <p className="text-ink/90 mb-6 max-w-md mx-auto">
              Share your experience with vendors you've worked with to help other parents make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="btn-primary px-6 py-3 rounded-md"
              >
                Browse Listings to Review
              </Link>
            </div>
          </div>
        )}

        {/* Help Text */}
        {reviews.length > 0 && (
          <div className="bg-surface/50 rounded-lg p-4 border border-surface/20">
            <p className="text-sm text-paper/70">
              💡 <strong>Review Status:</strong>
            </p>
            <ul className="text-sm text-paper/70 mt-2 space-y-1 ml-4">
              <li>• <strong className="text-yellow-500">Pending:</strong> Your review is awaiting moderation</li>
              <li>• <strong className="text-green-500">Published:</strong> Your review is live and visible to others</li>
              <li>• <strong className="text-red-500">Not Published:</strong> Review didn't meet community guidelines</li>
            </ul>
          </div>
        )}
      </div>
    </ParentDashboardLayout>
  );
}

/**
 * Review Card Component
 */
function ReviewCard({
  review,
  status,
}: {
  review: any;
  status: "pending" | "approved" | "rejected";
}) {
  const listing = review.listing;
  const listingSlug = listing?.slug || listing?.id;

  const statusColors = {
    pending: "border-yellow-500/30 bg-yellow-500/5",
    approved: "border-green-500/30 bg-green-500/5",
    rejected: "border-red-500/30 bg-red-500/5",
  };

  const statusLabels = {
    pending: "Pending Approval",
    approved: "Published",
    rejected: "Not Published",
  };

  const statusBadgeColors = {
    pending: "bg-yellow-500/20 text-yellow-300",
    approved: "bg-green-500/20 text-green-300",
    rejected: "bg-red-500/20 text-red-300",
  };

  return (
    <div
      className={`rounded-lg p-5 border ${statusColors[status]} transition-colors`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-base font-semibold text-paper mb-1">
                {listing?.listing_name || "Unknown Listing"}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= review.stars
                          ? "text-highlight"
                          : "text-paper/30"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-paper/70">
                  {review.stars} {review.stars === 1 ? "star" : "stars"}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusBadgeColors[status]}`}
            >
              {statusLabels[status]}
            </span>
          </div>

          <p className="text-paper/80 mb-3 leading-relaxed">
            {review.text}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-paper/60">
            {listing?.categories && listing.categories.length > 0 && (
              <div className="flex items-center gap-1">
                <span>📂</span>
                <span>{listing.categories[0]}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span>🕒</span>
              <span>Submitted {new Date(review.created_at).toLocaleDateString()}</span>
            </div>
            {review.updated_at !== review.created_at && (
              <div className="flex items-center gap-1">
                <span>📝</span>
                <span>Updated {new Date(review.updated_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {listingSlug && (
          <div className="md:w-auto">
            <Link
              href={`/listings/${listingSlug}`}
              className="btn-secondary text-center px-4 py-2 rounded-md text-sm whitespace-nowrap block"
            >
              View Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
