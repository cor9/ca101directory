import { createServerClient } from "@/lib/supabase";

/**
 * Conversion-focused analytics for admin dashboard
 */

export type SocialProofStats = {
  upgradesTodayCount: number;
  upgradesThisWeekCount: number;
  upgradesThisMonthCount: number;
  newListingsThisWeekCount: number;
  newListingsThisMonthCount: number;
  proMembersCount: number;
  categoryUpgradeLeader: string | null;
  categoryUpgradeCount: number;
};

export type HotLead = {
  listing_id: string;
  listing_name: string;
  slug: string;
  email: string;
  plan: string;
  views_last_7_days: number;
  category_avg_views: number;
  is_above_average: boolean;
  potential_revenue: number;
};

/**
 * Get social proof statistics for pricing/upgrade pages
 */
export async function getSocialProofStats(): Promise<SocialProofStats> {
  const supabase = createServerClient();

  try {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [{ data: listings }, { count: proMembers }] = await Promise.all([
      supabase
        .from("listings")
        .select("plan, categories, created_at, updated_at"),
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .in("plan", ["pro", "standard", "founding_pro", "founding_standard"])
        .eq("status", "Live"),
    ]);

    // Count upgrades (listings updated from free to paid in time period)
    const upgradesToday =
      listings?.filter(
        (l) => l.plan !== "free" && new Date(l.updated_at) >= todayStart,
      ).length || 0;

    const upgradesThisWeek =
      listings?.filter(
        (l) => l.plan !== "free" && new Date(l.updated_at) >= weekAgo,
      ).length || 0;

    const upgradesThisMonth =
      listings?.filter(
        (l) => l.plan !== "free" && new Date(l.updated_at) >= monthAgo,
      ).length || 0;

    // Count new listings
    const newListingsWeek =
      listings?.filter((l) => new Date(l.created_at) >= weekAgo).length || 0;

    const newListingsMonth =
      listings?.filter((l) => new Date(l.created_at) >= monthAgo).length || 0;

    // Find category with most upgrades
    const categoryUpgrades: Record<string, number> = {};
    listings
      ?.filter((l) => l.plan !== "free" && new Date(l.updated_at) >= monthAgo)
      .forEach((listing) => {
        const categories = listing.categories || [];
        categories.forEach((cat: string) => {
          categoryUpgrades[cat] = (categoryUpgrades[cat] || 0) + 1;
        });
      });

    const topCategory = Object.entries(categoryUpgrades).sort(
      ([, a], [, b]) => b - a,
    )[0];

    return {
      upgradesTodayCount: upgradesToday,
      upgradesThisWeekCount: upgradesThisWeek,
      upgradesThisMonthCount: upgradesThisMonth,
      newListingsThisWeekCount: newListingsWeek,
      newListingsThisMonthCount: newListingsMonth,
      proMembersCount: proMembers || 0,
      categoryUpgradeLeader: topCategory?.[0] || null,
      categoryUpgradeCount: topCategory?.[1] || 0,
    };
  } catch (error) {
    console.error("Error fetching social proof stats:", error);
    return {
      upgradesTodayCount: 0,
      upgradesThisWeekCount: 0,
      upgradesThisMonthCount: 0,
      newListingsThisWeekCount: 0,
      newListingsThisMonthCount: 0,
      proMembersCount: 0,
      categoryUpgradeLeader: null,
      categoryUpgradeCount: 0,
    };
  }
}

/**
 * Get "hot leads" - free listings with high traffic
 * These are prime targets for manual outreach
 */
export async function getHotLeads(minViews = 20): Promise<HotLead[]> {
  const supabase = createServerClient();

  try {
    // Get all free listings with their view counts
    const { data: stats } = await supabase
      .from("listing_stats")
      .select("*")
      .eq("plan", "free")
      .eq("status", "Live")
      .gte("views_last_7_days", minViews)
      .order("views_last_7_days", { ascending: false })
      .limit(25);

    if (!stats || stats.length === 0) {
      return [];
    }

    // Calculate category averages
    const categoryAverages: Record<string, number> = {};
    const { data: allListings } = await supabase
      .from("listing_stats")
      .select("categories, views_last_7_days");

    allListings?.forEach((listing: any) => {
      const categories = listing.categories || [];
      categories.forEach((cat: string) => {
        if (!categoryAverages[cat]) {
          categoryAverages[cat] = 0;
        }
        categoryAverages[cat] += listing.views_last_7_days || 0;
      });
    });

    // Calculate potential revenue (Standard = $25, Pro = $50)
    const potentialRevenue = (views: number) => {
      if (views > 50) return 50; // High traffic = Pro likely
      if (views > 30) return 25; // Medium traffic = Standard likely
      return 25; // Default to Standard
    };

    return stats.map((listing) => ({
      listing_id: listing.listing_id,
      listing_name: listing.listing_name,
      slug: listing.slug,
      email: listing.listing_email,
      plan: listing.plan,
      views_last_7_days: listing.views_last_7_days || 0,
      category_avg_views: 10, // Simplified for now
      is_above_average: (listing.views_last_7_days || 0) > 10,
      potential_revenue: potentialRevenue(listing.views_last_7_days || 0),
    }));
  } catch (error) {
    console.error("Error fetching hot leads:", error);
    return [];
  }
}

/**
 * Get conversion funnel metrics
 */
export async function getConversionFunnelStats() {
  const supabase = createServerClient();

  try {
    const { data: listings } = await supabase
      .from("listings")
      .select("status, is_claimed, plan");

    const total = listings?.length || 0;
    const live = listings?.filter((l) => l.status === "Live").length || 0;
    const claimed = listings?.filter((l) => l.is_claimed).length || 0;
    const paid = listings?.filter((l) => l.plan !== "free").length || 0;

    return {
      total,
      live,
      claimed,
      paid,
      liveRate: total > 0 ? (live / total) * 100 : 0,
      claimRate: live > 0 ? (claimed / live) * 100 : 0,
      upgradeRate: claimed > 0 ? (paid / claimed) * 100 : 0,
      overallConversionRate: total > 0 ? (paid / total) * 100 : 0,
    };
  } catch (error) {
    console.error("Error fetching funnel stats:", error);
    return {
      total: 0,
      live: 0,
      claimed: 0,
      paid: 0,
      liveRate: 0,
      claimRate: 0,
      upgradeRate: 0,
      overallConversionRate: 0,
    };
  }
}
