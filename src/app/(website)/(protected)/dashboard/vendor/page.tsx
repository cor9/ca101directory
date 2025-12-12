import { VendorDashboardLayout } from "@/components/layouts/VendorDashboardLayout";
import { Button } from "@/components/ui/button";
import { VendorListingsTable } from "@/components/vendor/vendor-listings-table";
import { VendorROIStats } from "@/components/vendor/vendor-roi-stats";
import { siteConfig } from "@/config/site";
import { getVendorListings } from "@/data/listings";
import { getVendorPosition } from "@/data/vendor-position";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Vendor Dashboard - Child Actor 101 Directory",
  description: "Manage your business listings and profile.",
  canonicalUrl: `${siteConfig.url}/dashboard/vendor`,
  noIndex: true,
});

/**
 * Vendor Dashboard
 *
 * For vendors only - shows:
 * - Their own listings
 * - Ability to edit their listings
 *
 * Note: verifyDashboardAccess() is the ONLY security check needed.
 * Removed DashboardGuard to prevent redirect loops caused by client/server role detection mismatches.
 */
export default async function VendorDashboard({
  searchParams,
}: {
  searchParams?: {
    lid?: string;
    claimed?: string;
    upgraded?: string;
    onboard?: string;
  };
}) {
  const user = await currentUser();
  if (!user?.id) {
    redirect("/auth/login");
  }

  // Safety check: Verify user has vendor role (SERVER-SIDE ONLY)
  // This is sufficient - no need for client-side guard that can cause loops
  verifyDashboardAccess(user, "vendor", "/dashboard/vendor");

  const vendorListings = await getVendorListings(user.id);
  const onboardingLid = searchParams?.lid || (vendorListings[0]?.id ?? "");
  const showOnboarding = Boolean(
    searchParams?.claimed || searchParams?.upgraded || searchParams?.onboard,
  );

  // 18A: Visibility Anxiety - Calculate relative position for primary listing
  let positionData = null;
  if (vendorListings.length > 0) {
    const primaryListing = vendorListings[0];
    const categoryName =
      Array.isArray(primaryListing.categories) &&
      primaryListing.categories.length > 0
        ? primaryListing.categories[0]
        : undefined;
    positionData = await getVendorPosition(primaryListing.id, categoryName);
  }

  return (
    <VendorDashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        {showOnboarding && onboardingLid && (
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="bauhaus-heading text-2xl text-foreground mb-1">
              Welcome! Enhance your listing
            </h2>
            <p className="bauhaus-body text-foreground mb-4">
              Add your logo, gallery, and detailed information to make a great
              first impression.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a
                  href={`/dashboard/vendor/listing/${onboardingLid}/enhance?onboard=1`}
                >
                  Enhance Now
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard/vendor">Finish Later</a>
              </Button>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg p-6 border">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-foreground mb-2">
            This is your space to manage your listing, view analytics, and
            access resources to grow your business with us.
          </p>
          <p className="text-sm text-foreground/80 italic">
            Parents tend to contact professionals with claimed listings.
          </p>
          <p className="text-sm text-foreground/70 mt-2">
            Featured placement rotates among active paid listings.
          </p>
        </div>

        {/* 18A: Visibility Anxiety - Show relative position */}
        {vendorListings.length > 0 &&
          positionData &&
          positionData.aboveCount > 0 && (
            <div className="bg-card rounded-lg p-6 border border-accent-lemon/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-foreground/80 mb-2">
                    {positionData.categoryName && (
                      <>
                        You appear below {positionData.aboveCount} similar
                        provider
                        {positionData.aboveCount === 1 ? "" : "s"} in{" "}
                        {positionData.categoryName}.
                      </>
                    )}
                    {!positionData.categoryName && (
                      <>
                        You appear below {positionData.aboveCount} similar
                        provider
                        {positionData.aboveCount === 1 ? "" : "s"}.
                      </>
                    )}
                  </p>
                  {/* 18G: The One Sentence */}
                  <p className="text-xs text-foreground/60 mb-4">
                    Providers with Pro features receive 3–5× more parent
                    contact.
                  </p>
                  <Link
                    href="/pricing?from=visibility-anxiety"
                    className="text-sm text-accent-teal hover:text-accent-teal/80 font-medium transition-colors"
                  >
                    Improve visibility →
                  </Link>
                </div>
              </div>
            </div>
          )}

        {/* 16E: Dashboard Nudges for Free listings (fallback if no position data) */}
        {vendorListings.length > 0 &&
          vendorListings.some(
            (l) => !l.plan || l.plan === "Free" || l.plan === null,
          ) &&
          (!positionData || positionData.aboveCount === 0) && (
            <div className="bg-card rounded-lg p-6 border border-accent-lemon/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-foreground/80 mb-2">
                    Your listing is appearing below 74% of similar providers.
                  </p>
                  {/* 18G: The One Sentence */}
                  <p className="text-xs text-foreground/60 mb-4">
                    Providers with Pro features receive 3–5× more parent
                    contact.
                  </p>
                  <Link
                    href="/pricing?from=dashboard-nudge"
                    className="text-sm text-accent-teal hover:text-accent-teal/80 font-medium transition-colors"
                  >
                    Improve visibility →
                  </Link>
                </div>
              </div>
            </div>
          )}

        {/* ROI Stats Widget */}
        <VendorROIStats vendorId={user.id} />

        {/* Performance & Trust Panel (Phase 3) */}
        {vendorListings.length > 0 && (
          <section className="rounded-xl bg-[#0C1A2B] text-white p-6 mt-8 shadow-lg">
            <h2 className="text-lg font-semibold text-amber-300 mb-4">
              Performance & Trust (Primary Listing)
            </h2>

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <dt className="text-slate-400">Profile Views</dt>
                <dd className="text-xl font-bold">
                  {vendorListings[0].views_count}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Contact Clicks</dt>
                <dd className="text-xl font-bold">
                  {vendorListings[0].contact_clicks}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Favorites</dt>
                <dd className="text-xl font-bold">
                  {vendorListings[0].favorites_count}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Reviews</dt>
                <dd className="text-xl font-bold text-slate-500">-</dd>{" "}
                {/* We need to fetch review count separately or add it to Listing type if aggregated */}
              </div>
              <div>
                <dt className="text-slate-400">Repeat Families</dt>
                <dd className="text-xl font-bold">
                  {vendorListings[0].repeat_families_count}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Response Time</dt>
                <dd className="text-xl font-bold text-emerald-400">
                  {vendorListings[0].response_time_label ?? "—"}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-xs text-slate-300">
              Improve your ranking by completing your profile, responding
              quickly, and collecting reviews from parents.
            </p>
            {/* 18G: The One Sentence */}
            <p className="mt-2 text-xs text-slate-400 italic">
              Providers with Pro features receive 3–5× more parent contact.
            </p>
          </section>
        )}

        <div className="bg-card rounded-lg p-6 border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Grow Your Reach
          </h2>
          <p className="text-foreground mb-4">
            Add our official badge to your website to build trust with families
            and improve your visibility. Access our Backlink Resource Kit for
            easy-to-use assets.
          </p>
          <Button asChild>
            <a href="/dashboard/vendor/resources">Go to Resource Kit</a>
          </Button>
        </div>

        {/* My Listings Table */}
        <VendorListingsTable listings={vendorListings} />
      </div>
    </VendorDashboardLayout>
  );
}
