import { auth } from "@/auth";
import { ParentDashboardLayout } from "@/components/layouts/ParentDashboardLayout";
import {
  isFavoritesEnabled,
  isParentDashboardEnabled,
} from "@/config/feature-flags";
import { siteConfig } from "@/config/site";
import { getUserFavorites } from "@/data/favorites";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = constructMetadata({
  title: "My Favorites - Parent Dashboard",
  description: "View and manage your saved listings",
  canonicalUrl: `${siteConfig.url}/dashboard/parent/favorites`,
});

/**
 * Parent Favorites Page
 *
 * Shows all listings favorited/saved by the parent user
 * with options to view details or remove from favorites
 */
export default async function ParentFavoritesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/dashboard/parent/favorites");
  }

  // Check if parent dashboard and favorites are enabled
  if (!isParentDashboardEnabled() || !isFavoritesEnabled()) {
    redirect("/dashboard/parent");
  }

  // Verify user has parent role
  verifyDashboardAccess(session.user as any, "parent", "/dashboard/parent/favorites");

  // Fetch user's favorites
  const favorites = await getUserFavorites(session.user.id);

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-orange/10 to-secondary-denim/10 rounded-lg p-6 border border-primary-orange/20">
          <h1 className="text-2xl font-bold text-paper mb-2">
            My Favorites
          </h1>
          <p className="text-paper/90">
            Listings you've saved for easy access and comparison
          </p>
        </div>

        {/* Stats */}
        <div className="bg-surface rounded-lg p-4 border border-surface/20">
          <div className="text-2xl font-bold text-primary-orange">
            {favorites.length}
          </div>
          <div className="text-paper">Saved Listings</div>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((favorite) => {
              const listing = favorite.listing;
              const listingSlug = listing?.slug || listing?.id;

              return (
                <div
                  key={favorite.id}
                  className="bg-surface rounded-lg p-6 border border-surface/20 hover:border-primary-orange/40 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-paper mb-2">
                        {listing?.listing_name || "Unknown Listing"}
                      </h3>

                      {listing?.what_you_offer && (
                        <p className="text-paper/80 mb-3 line-clamp-2">
                          {listing.what_you_offer}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-paper/70">
                        {listing?.categories && listing.categories.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>📂</span>
                            <span>{listing.categories[0]}</span>
                          </div>
                        )}
                        {listing?.city && listing?.state && (
                          <div className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{listing.city}, {listing.state}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span>🕒</span>
                          <span>Saved {new Date(favorite.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:w-auto">
                      {listingSlug && (
                        <Link
                          href={`/listings/${listingSlug}`}
                          className="btn-primary text-center px-4 py-2 rounded-md text-sm whitespace-nowrap"
                        >
                          View Listing
                        </Link>
                      )}

                      {listing?.website && (
                        <a
                          href={listing.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-center px-4 py-2 rounded-md text-sm whitespace-nowrap"
                        >
                          Visit Website ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-surface/20 rounded-lg p-12 text-center border border-surface/20">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-xl font-semibold mb-2 text-ink">
              No Favorites Yet
            </h2>
            <p className="text-ink/90 mb-6 max-w-md mx-auto">
              Start exploring the directory and click the heart icon on listings you want to save for later.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="btn-primary px-6 py-3 rounded-md"
              >
                Browse All Listings
              </Link>
              <Link
                href="/?category=Acting+Coaches"
                className="btn-secondary px-6 py-3 rounded-md"
              >
                Find Acting Coaches
              </Link>
            </div>
          </div>
        )}

        {/* Help Text */}
        {favorites.length > 0 && (
          <div className="bg-surface/50 rounded-lg p-4 border border-surface/20">
            <p className="text-sm text-paper/70">
              💡 <strong>Tip:</strong> Click the heart icon on any listing page to remove it from your favorites.
            </p>
          </div>
        )}
      </div>
    </ParentDashboardLayout>
  );
}
