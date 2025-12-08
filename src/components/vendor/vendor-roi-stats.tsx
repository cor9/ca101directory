import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getVendorListingsStats } from "@/data/listing-views";
import { Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";

type Props = {
  vendorId: string;
};

export async function VendorROIStats({ vendorId }: Props) {
  const listings = await getVendorListingsStats(vendorId);

  if (!listings || listings.length === 0) {
    return null;
  }

  // Aggregate stats across all listings
  const totalViews30Days = listings.reduce(
    (sum, l) => sum + (l.stats?.views_last_30_days || 0),
    0
  );
  const totalViews7Days = listings.reduce(
    (sum, l) => sum + (l.stats?.views_last_7_days || 0),
    0
  );
  const totalFavorites = listings.reduce(
    (sum, l) => sum + (l.stats?.favorites_count || 0),
    0
  );

  // Calculate growth
  const avgGrowth = listings.reduce(
    (sum, l) => sum + (l.stats?.growth_percentage || 0),
    0
  ) / listings.length;

  const growthIcon = avgGrowth > 0 ? TrendingUp : avgGrowth < 0 ? TrendingDown : Minus;
  const growthColor = avgGrowth > 0 ? "text-green-600" : avgGrowth < 0 ? "text-red-600" : "text-gray-500";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Your Listing Performance
        </CardTitle>
        <CardDescription>
          See how parents are finding you this month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main stat */}
          <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="text-4xl font-bold text-foreground">
              {totalViews30Days}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Profile views this month
            </div>
          </div>

          {/* Secondary stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-semibold text-foreground">
                {totalViews7Days}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Views this week
              </div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-semibold text-foreground">
                {totalFavorites}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Total favorites
              </div>
            </div>
          </div>

          {/* Growth indicator */}
          {avgGrowth !== 0 && (
            <div className={`flex items-center justify-center gap-2 text-sm ${growthColor}`}>
              {growthIcon && <span className="inline-block"><Eye className="h-4 w-4" /></span>}
              <span className="font-medium">
                {avgGrowth > 0 ? "+" : ""}{avgGrowth}% vs last month
              </span>
            </div>
          )}

          {/* Per-listing breakdown */}
          {listings.length > 1 && (
            <div className="border-t pt-4">
              <div className="text-sm font-medium text-foreground mb-3">
                By Listing:
              </div>
              <div className="space-y-2">
                {listings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate flex-1 mr-2">
                      {listing.listing_name}
                    </span>
                    <span className="font-medium text-foreground">
                      {listing.stats?.views_last_30_days || 0} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upgrade CTA for free users */}
          {listings.some(l => l.plan === "free") && totalViews30Days > 10 && (
            <div className="border-t pt-4">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                  💡 Pro Tip
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  You're getting great traffic! Pro members with similar views get 3-5x more inquiries with featured placement and photos.
                </div>
                <a
                  href="/pricing"
                  className="inline-block mt-3 text-xs font-medium text-amber-900 dark:text-amber-100 underline hover:no-underline"
                >
                  See Pro Plans →
                </a>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
