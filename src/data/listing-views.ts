import { createServerClient } from "@/lib/supabase";

/**
 * Listing views and vendor analytics
 */

export type ListingStats = {
  listing_id: string;
  views_last_30_days: number;
  views_last_7_days: number;
  views_all_time: number;
  views_previous_30_days: number;
  growth_percentage: number;
  favorites_count: number;
  reviews_count: number;
  avg_rating: number | null;
};

/**
 * Get view stats for a specific listing (for vendor dashboard)
 */
export async function getListingViewStats(
  listingId: string
): Promise<ListingStats | null> {
  const supabase = createServerClient();

  try {
    // Try to get from materialized view first (faster)
    const { data: statsData, error: statsError } = await supabase
      .from("listing_stats")
      .select("*")
      .eq("listing_id", listingId)
      .single();

    if (!statsError && statsData) {
      return {
        listing_id: statsData.listing_id,
        views_last_30_days: statsData.views_last_30_days || 0,
        views_last_7_days: statsData.views_last_7_days || 0,
        views_all_time: statsData.views_all_time || 0,
        views_previous_30_days: statsData.views_previous_30_days || 0,
        growth_percentage: calculateGrowth(
          statsData.views_last_30_days,
          statsData.views_previous_30_days
        ),
        favorites_count: statsData.favorites_count || 0,
        reviews_count: statsData.reviews_count || 0,
        avg_rating: statsData.avg_rating,
      };
    }

    // Fallback: calculate real-time
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      { count: views30 },
      { count: views7 },
      { count: viewsAll },
      { count: viewsPrev30 },
      { count: favorites },
      { data: reviews },
    ] = await Promise.all([
      supabase
        .from("listing_views")
        .select("id", { count: "exact", head: true })
        .eq("listing_id", listingId)
        .gte("viewed_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("listing_views")
        .select("id", { count: "exact", head: true })
        .eq("listing_id", listingId)
        .gte("viewed_at", sevenDaysAgo.toISOString()),
      supabase
        .from("listing_views")
        .select("id", { count: "exact", head: true })
        .eq("listing_id", listingId),
      supabase
        .from("listing_views")
        .select("id", { count: "exact", head: true })
        .eq("listing_id", listingId)
        .gte("viewed_at", sixtyDaysAgo.toISOString())
        .lt("viewed_at", thirtyDaysAgo.toISOString()),
      supabase
        .from("favorites")
        .select("id", { count: "exact", head: true })
        .eq("listing_id", listingId),
      supabase
        .from("reviews")
        .select("stars")
        .eq("listing_id", listingId)
        .eq("status", "approved"),
    ]);

    const avgRating =
      reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.stars || 0), 0) / reviews.length
        : null;

    return {
      listing_id: listingId,
      views_last_30_days: views30 || 0,
      views_last_7_days: views7 || 0,
      views_all_time: viewsAll || 0,
      views_previous_30_days: viewsPrev30 || 0,
      growth_percentage: calculateGrowth(views30 || 0, viewsPrev30 || 0),
      favorites_count: favorites || 0,
      reviews_count: reviews?.length || 0,
      avg_rating: avgRating ? Math.round(avgRating * 10) / 10 : null,
    };
  } catch (error) {
    console.error("Error fetching listing stats:", error);
    return null;
  }
}

/**
 * Calculate percentage growth
 */
function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Get all listings owned by a vendor with their stats
 */
export async function getVendorListingsStats(vendorId: string) {
  const supabase = createServerClient();

  try {
    const { data: listings } = await supabase
      .from("listings")
      .select("id, slug, listing_name, plan, status")
      .eq("owner_id", vendorId);

    if (!listings || listings.length === 0) {
      return [];
    }

    const statsPromises = listings.map((listing) =>
      getListingViewStats(listing.id).then((stats) => ({
        ...listing,
        stats,
      }))
    );

    return await Promise.all(statsPromises);
  } catch (error) {
    console.error("Error fetching vendor listings stats:", error);
    return [];
  }
}

/**
 * Refresh materialized view (call this via cron job)
 */
export async function refreshListingStats() {
  const supabase = createServerClient();

  try {
    const { error } = await supabase.rpc("refresh_listing_stats");
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error refreshing listing stats:", error);
    return false;
  }
}
