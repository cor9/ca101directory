import { createServerClient } from "@/lib/supabase";

/**
 * Analytics data functions for admin dashboard
 * Provides time-series and distribution data for visualizations
 */

export type TimeSeriesDataPoint = {
  date: string;
  count: number;
  label?: string;
};

export type DistributionDataPoint = {
  name: string;
  value: number;
  percentage?: number;
};

export type AnalyticsSummary = {
  totalListings: number;
  totalUsers: number;
  totalReviews: number;
  totalFavorites: number;
  avgRating: number;
  claimRate: number;
  paidListingsRate: number;
};

/**
 * Get platform-wide summary statistics
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = createServerClient();

  try {
    // Get all metrics in parallel
    const [
      { count: totalListings },
      { count: totalUsers },
      { count: totalReviews },
      { count: totalFavorites },
      { data: listings },
      { data: reviews },
    ] = await Promise.all([
      supabase.from("listings").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("reviews").select("id", { count: "exact", head: true }),
      supabase.from("favorites").select("id", { count: "exact", head: true }),
      supabase.from("listings").select("is_claimed, plan"),
      supabase.from("reviews").select("stars").eq("status", "approved"),
    ]);

    // Calculate average rating
    const avgRating =
      reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + (r.stars || 0), 0) / reviews.length
        : 0;

    // Calculate claim rate
    const claimedListings =
      listings?.filter((l) => l.is_claimed === true).length || 0;
    const claimRate =
      totalListings && totalListings > 0
        ? (claimedListings / totalListings) * 100
        : 0;

    // Calculate paid listings rate
    const paidListings =
      listings?.filter((l) => l.plan && l.plan !== "free").length || 0;
    const paidListingsRate =
      totalListings && totalListings > 0
        ? (paidListings / totalListings) * 100
        : 0;

    return {
      totalListings: totalListings || 0,
      totalUsers: totalUsers || 0,
      totalReviews: totalReviews || 0,
      totalFavorites: totalFavorites || 0,
      avgRating: Math.round(avgRating * 10) / 10,
      claimRate: Math.round(claimRate * 10) / 10,
      paidListingsRate: Math.round(paidListingsRate * 10) / 10,
    };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return {
      totalListings: 0,
      totalUsers: 0,
      totalReviews: 0,
      totalFavorites: 0,
      avgRating: 0,
      claimRate: 0,
      paidListingsRate: 0,
    };
  }
}

/**
 * Get listings created over time (last 30 days)
 */
export async function getListingsGrowth(
  days = 30,
): Promise<TimeSeriesDataPoint[]> {
  const supabase = createServerClient();

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("listings")
      .select("created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Group by date
    const grouped = (data || []).reduce(
      (acc, listing) => {
        const date = new Date(listing.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Fill in missing dates with 0
    const result: TimeSeriesDataPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        count: grouped[dateStr] || 0,
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching listings growth:", error);
    return [];
  }
}

/**
 * Get users created over time (last 30 days)
 */
export async function getUsersGrowth(
  days = 30,
): Promise<TimeSeriesDataPoint[]> {
  const supabase = createServerClient();

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("profiles")
      .select("created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Group by date
    const grouped = (data || []).reduce(
      (acc, profile) => {
        const date = new Date(profile.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Fill in missing dates with 0
    const result: TimeSeriesDataPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        count: grouped[dateStr] || 0,
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching users growth:", error);
    return [];
  }
}

/**
 * Get listing distribution by plan
 */
export async function getListingsByPlan(): Promise<DistributionDataPoint[]> {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("plan")
      .eq("status", "Live")
      .eq("is_active", true);

    if (error) throw error;

    const grouped = (data || []).reduce(
      (acc, listing) => {
        const plan = listing.plan || "free";
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = Object.values(grouped).reduce((sum, count) => sum + count, 0);

    return Object.entries(grouped).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
  } catch (error) {
    console.error("Error fetching listings by plan:", error);
    return [];
  }
}

/**
 * Get listing distribution by status
 */
export async function getListingsByStatus(): Promise<DistributionDataPoint[]> {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase.from("listings").select("status");

    if (error) throw error;

    const grouped = (data || []).reduce(
      (acc, listing) => {
        const status = listing.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = Object.values(grouped).reduce((sum, count) => sum + count, 0);

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
  } catch (error) {
    console.error("Error fetching listings by status:", error);
    return [];
  }
}

/**
 * Get review rating distribution
 */
export async function getReviewRatingDistribution(): Promise<
  DistributionDataPoint[]
> {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("stars")
      .eq("status", "approved");

    if (error) throw error;

    const grouped = (data || []).reduce(
      (acc, review) => {
        const stars = review.stars || 0;
        acc[stars] = (acc[stars] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    return [1, 2, 3, 4, 5].map((stars) => ({
      name: `${stars} Star${stars !== 1 ? "s" : ""}`,
      value: grouped[stars] || 0,
    }));
  } catch (error) {
    console.error("Error fetching review rating distribution:", error);
    return [];
  }
}

/**
 * Get users distribution by role
 */
export async function getUsersByRole(): Promise<DistributionDataPoint[]> {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase.from("profiles").select("role");

    if (error) throw error;

    const grouped = (data || []).reduce(
      (acc, profile) => {
        const role = profile.role || "parent";
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = Object.values(grouped).reduce((sum, count) => sum + count, 0);

    return Object.entries(grouped).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }));
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return [];
  }
}

/**
 * Get top categories by listing count
 */
export async function getTopCategories(
  limit = 10,
): Promise<DistributionDataPoint[]> {
  const supabase = createServerClient();

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("categories")
      .eq("status", "Live")
      .eq("is_active", true);

    if (error) throw error;

    // Flatten categories array and count
    const categoryCounts = (data || []).reduce(
      (acc, listing) => {
        (listing.categories || []).forEach((category: string) => {
          acc[category] = (acc[category] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching top categories:", error);
    return [];
  }
}

/**
 * Get reviews created over time (last 30 days)
 */
export async function getReviewsGrowth(
  days = 30,
): Promise<TimeSeriesDataPoint[]> {
  const supabase = createServerClient();

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("reviews")
      .select("created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Group by date
    const grouped = (data || []).reduce(
      (acc, review) => {
        const date = new Date(review.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Fill in missing dates with 0
    const result: TimeSeriesDataPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        count: grouped[dateStr] || 0,
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching reviews growth:", error);
    return [];
  }
}
