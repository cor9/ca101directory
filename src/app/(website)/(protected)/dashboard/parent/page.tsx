import { auth } from "@/auth";
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
 * Parent Dashboard - For users who don't have listings
 * This is where parents can search listings, save favorites, and view resources
 */
export default async function ParentDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
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
    <ParentDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome, Parent!
          </h1>
          <p className="text-muted-foreground">
            Here you'll find your saved vendors, reviews, and tools to help your
            child's acting journey.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {isFavoritesEnabled() && (
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-primary">
                {favorites.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Saved Listings
              </div>
            </div>
          )}
          {isReviewsEnabled() && (
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl font-bold text-primary">
                {reviews.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Reviews Written
              </div>
            </div>
          )}
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">
              {favorites.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Favorites</div>
          </div>
        </div>

        {/* Recent Favorites */}
        {isFavoritesEnabled() && favorites.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Favorites</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favorites.slice(0, 6).map((favorite) => (
                <div
                  key={favorite.id}
                  className="bg-card rounded-lg p-4 border"
                >
                  <h3 className="font-medium text-sm mb-2">
                    {favorite.listing?.["Listing Name"] || "Unknown Listing"}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {favorite.listing?.["What You Offer?"] ||
                      "No description available"}
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Saved {new Date(favorite.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            {favorites.length > 6 && (
              <div className="mt-4 text-center">
                <a
                  href="/dashboard/parent/favorites"
                  className="text-sm text-primary hover:underline"
                >
                  View all {favorites.length} favorites →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Recent Reviews */}
        {isReviewsEnabled() && reviews.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">
                      {review.listing?.["Listing Name"] || "Unknown Listing"}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xs ${
                            star <= review.stars
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {review.text}
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">
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
                  className="text-sm text-primary hover:underline"
                >
                  View all {reviews.length} reviews →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Search & Discovery</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  •{" "}
                  <a href="/" className="text-primary hover:underline">
                    Browse all listings
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/?category=Acting+Coaches"
                    className="text-primary hover:underline"
                  >
                    Find acting coaches
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/?category=Headshot+Photographers"
                    className="text-primary hover:underline"
                  >
                    Find photographers
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Your Activity</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {isFavoritesEnabled() && (
                  <li>
                    •{" "}
                    <a
                      href="/dashboard/parent/favorites"
                      className="text-primary hover:underline"
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
                      className="text-primary hover:underline"
                    >
                      View your reviews
                    </a>
                  </li>
                )}
                <li>
                  •{" "}
                  <a href="/settings" className="text-primary hover:underline">
                    Account settings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ParentDashboardLayout>
  );
}
