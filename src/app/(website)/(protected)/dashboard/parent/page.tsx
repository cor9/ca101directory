import { auth } from "@/auth";
import { DashboardGuard } from "@/components/auth/role-guard";
import { ParentDashboardLayout } from "@/components/layouts/ParentDashboardLayout";
import {
  isFavoritesEnabled,
  isParentDashboardEnabled,
  isReviewsEnabled,
} from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getUserFavorites } from "@/data/favorites";
import { getUserReviews } from "@/data/reviews";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Parent Dashboard - Child Actor 101 Directory",
  description: "Find and manage resources for your child's acting journey",
  canonicalUrl: `${siteConfig.url}/dashboard/parent`,
});

/**
 * Parent Dashboard - Phase 4.1: Dashboard Redesign & Role Separation
 *
 * For parents only - shows:
 * - Saved favorites
 * - Reviews (pending, approved)
 * - Activity stats
 * - Quick actions: "Discover Vendors," "Update Account Info"
 *
 * NO vendor content (no billing, no listing submission)
 */
export default async function ParentDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?next=/dashboard/parent");
  }

  // Check if parent dashboard is enabled
  if (!isParentDashboardEnabled()) {
    redirect("/auth/login");
  }

  // Fetch user data
  const [favorites, reviews] = await Promise.all([
    isFavoritesEnabled() ? getUserFavorites(session.user.id) : [],
    isReviewsEnabled() ? getUserReviews(session.user.id) : [],
  ]);

  return (
    <DashboardGuard allowedRoles={["parent"]}>
      <ParentDashboardLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-orange/10 to-secondary-denim/10 rounded-lg p-6 border border-primary-orange/20">
            <h1 className="text-2xl font-bold text-paper mb-2">
              Welcome, Parent!
            </h1>
            <p className="text-paper/90">
              Here you'll find your saved vendors, reviews, and tools to help
              your child's acting journey.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {isFavoritesEnabled() && (
              <div className="surface rounded-lg p-4 border border-surface/20">
                <div className="text-2xl font-bold text-primary-orange">
                  {favorites.length}
                </div>
                <div className="text-paper">
                  Saved Listings
                </div>
              </div>
            )}
            {isReviewsEnabled() && (
              <div className="surface rounded-lg p-4 border border-surface/20">
                <div className="text-2xl font-bold text-primary-orange">
                  {reviews.length}
                </div>
                <div className="text-paper">
                  Reviews Written
                </div>
              </div>
            )}
            <div className="surface rounded-lg p-4 border border-surface/20">
              <div className="text-2xl font-bold text-primary-orange">
                {favorites.length + reviews.length}
              </div>
              <div className="text-paper">
                Total Activity
              </div>
            </div>
          </div>

          {/* Recent Favorites */}
          {isFavoritesEnabled() && favorites.length > 0 && (
            <div className="bg-surface rounded-lg p-6 border border-surface/20">
              <h2 className="text-lg font-semibold mb-4 text-ink">
                Recent Favorites
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favorites.slice(0, 6).map((favorite) => (
                  <div
                    key={favorite.id}
                    className="surface rounded-lg p-4 border border-surface/20"
                  >
                    <h3 className="font-medium text-sm mb-2 text-paper">
                      {favorite.listing?.listing_name || "Unknown Listing"}
                    </h3>
                    <p
                      className="text-xs line-clamp-2 text-paper"
                    >
                      {favorite.listing?.what_you_offer ||
                        "No description available"}
                    </p>
                    <div className="text-paper">
                      Saved {new Date(favorite.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              {favorites.length > 6 && (
                <div className="mt-4 text-center">
                  <a
                    href="/dashboard/parent/favorites"
                    className="text-sm text-primary-orange hover:underline"
                  >
                    View all {favorites.length} favorites →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Recent Reviews */}
          {isReviewsEnabled() && reviews.length > 0 && (
            <div className="bg-surface rounded-lg p-6 border border-surface/20">
              <h2 className="text-lg font-semibold mb-4 text-ink">
                Recent Reviews
              </h2>
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="surface rounded-lg p-4 border border-surface/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="font-medium text-sm text-paper"
                      >
                        {review.listing?.listing_name || "Unknown Listing"}
                      </h3>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xs ${
                              star <= review.stars
                                ? "text-highlight"
                                : "text-paper"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p
                      className="text-xs line-clamp-2 text-paper"
                    >
                      {review.text}
                    </p>
                    <div className="text-paper">
                      {review.status === "approved"
                        ? "Published"
                        : "Pending approval"}{" "}
                      • {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              {reviews.length > 3 && (
                <div className="mt-4 text-center">
                  <a
                    href="/dashboard/parent/reviews"
                    className="text-sm text-primary-orange hover:underline"
                  >
                    View all {reviews.length} reviews →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {favorites.length === 0 && reviews.length === 0 && (
            <div className="bg-surface/20 rounded-lg p-6 text-center border border-surface/20">
              <h2 className="text-lg font-semibold mb-2 text-ink">
                Get Started
              </h2>
              <p className="text-ink/90 mb-4">
                Start exploring the directory to find professionals for your
                child's acting journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 btn-primary"
                >
                  Browse All Listings
                </a>
                <a
                  href="/?category=Acting+Coaches"
                  className="inline-flex items-center px-4 py-2 btn-secondary"
                >
                  Find Acting Coaches
                </a>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-surface rounded-lg p-6 border border-surface/20">
            <h2 className="text-lg font-semibold mb-4 text-ink">
              Quick Actions
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium text-paper">Discover Vendors</h3>
                <ul className="text-paper">
                  <li>
                    •{" "}
                    <a href="/" className="text-primary-orange hover:underline">
                      Browse all listings
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a
                      href="/?category=Acting+Coaches"
                      className="text-primary-orange hover:underline"
                    >
                      Find acting coaches
                    </a>
                  </li>
                  <li>
                    •{" "}
                    <a
                      href="/?category=Headshot+Photographers"
                      className="text-primary-orange hover:underline"
                    >
                      Find photographers
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-paper">Your Activity</h3>
                <ul className="text-paper">
                  {isFavoritesEnabled() && (
                    <li>
                      •{" "}
                      <a
                        href="/dashboard/parent/favorites"
                        className="text-primary-orange hover:underline"
                      >
                        Manage favorites
                      </a>
                    </li>
                  )}
                  {isReviewsEnabled() && (
                    <li>
                      •{" "}
                      <a
                        href="/dashboard/parent/reviews"
                        className="text-primary-orange hover:underline"
                      >
                        View your reviews
                      </a>
                    </li>
                  )}
                  <li>
                    •{" "}
                    <a
                      href="/settings"
                      className="text-primary-orange hover:underline"
                    >
                      Update account info
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ParentDashboardLayout>
    </DashboardGuard>
  );
}
