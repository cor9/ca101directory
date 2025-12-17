import { deleteListing } from "@/actions/listings";
import AdminListingsSearch from "@/components/admin/admin-listings-search";
import { BulkResendButton } from "@/components/admin/bulk-resend-button";
import { BulkResendClaimButton } from "@/components/admin/bulk-resend-claim-button";
import { BulkResendRecentButton } from "@/components/admin/bulk-resend-recent-button";
import { CompedToggle } from "@/components/admin/comped-toggle";
import { ListingActions } from "@/components/admin/listing-actions";
import { ViewClaimLinks } from "@/components/admin/view-claim-links";
import { AdminDashboardLayout } from "@/components/layouts/AdminDashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getAdminListings } from "@/data/listings";
import { currentUser } from "@/lib/auth";
import { verifyDashboardAccess } from "@/lib/dashboard-safety";
import { constructMetadata } from "@/lib/metadata";
import {
  CheckCircleIcon,
  EditIcon,
  EyeIcon,
  Sparkles,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Admin Listings Management - Child Actor 101 Directory",
  description: "Manage and moderate all listings on the platform",
  canonicalUrl: `${siteConfig.url}/dashboard/admin/listings`,
  noIndex: true,
});

/**
 * Admin Listings Management Page
 *
 * Allows admins to:
 * - View all listings
 * - Toggle comped status
 * - Edit listing details
 * - Approve/reject listings
 */
export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams?: { status?: string; q?: string };
}) {
  // Temporary feature toggle: hide bulk resend sections unless explicitly enabled
  const showBulkResendSections = false;
  const user = await currentUser();

  if (!user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/admin/listings");
  }

  verifyDashboardAccess(user, "admin", "/dashboard/admin/listings");

  // Get all listings for admin management (including Pending, Rejected, etc.)
  const allListings = await getAdminListings();

  // Filter by status if provided
  const statusFilter = searchParams?.status;
  const q = (searchParams?.q || "").toLowerCase().trim();
  const filteredListings = (
    statusFilter
      ? allListings.filter((listing) => listing.status === statusFilter)
      : allListings
  ).filter((l) => {
    if (!q) return true;
    const name = (l.listing_name || "").toLowerCase();
    const email = (l.email || "").toLowerCase();
    const website = (l.website || "").toLowerCase();
    const city = (l.city || "").toLowerCase();
    const state = (l.state || "").toLowerCase();
    return (
      name.includes(q) ||
      email.includes(q) ||
      website.includes(q) ||
      city.includes(q) ||
      state.includes(q)
    );
  });

  // Sort listings by plan priority and name
  const sortedListings = filteredListings.sort((a, b) => {
    const planPriority = (plan: string | null, comped: boolean | null) => {
      if (comped) return 3; // Comped listings are treated as Pro
      const p = (plan || "free").toLowerCase();
      switch (p) {
        case "pro":
        case "founding pro":
          return 3;
        case "standard":
        case "founding standard":
          return 2;
        case "free":
          return 1;
        default:
          return 0; // null/undefined plans default to Free
      }
    };

    const aPriority = planPriority(a.plan, a.comped);
    const bPriority = planPriority(b.plan, b.comped);

    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }
    return (a.listing_name || "").localeCompare(b.listing_name || "");
  });

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-paper">
              Listings Management
            </h1>
            <p className="text-paper">
              Manage all listings, toggle comped status, and moderate content
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <AdminListingsSearch />
            </div>
            <div className="text-sm text-paper">
              {sortedListings.length} total listings
            </div>
            <Button asChild className="bg-brand-blue hover:bg-brand-blue/90">
              <Link href="/dashboard/admin/create">
                <EditIcon className="w-4 h-4 mr-2" />
                Create New Listing
              </Link>
            </Button>
          </div>
        </div>

        {/* Bulk Resend Sections (hidden by default) */}
        {showBulkResendSections && (
          <>
            <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-paper">Bulk Resend Emails</p>
                <p className="text-sm text-paper/70">
                  Send "listing live" emails to all 24 listings updated on
                  November 6, 2025
                </p>
              </div>
              <BulkResendButton />
            </div>
            <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-paper">
                  Bulk Resend Claim Emails
                </p>
                <p className="text-sm text-paper/70">
                  Send claim emails to all ~200 Headshot Photographers listings
                </p>
              </div>
              <BulkResendClaimButton />
            </div>
            <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-paper">
                  Bulk Resend (Recent Adds)
                </p>
                <p className="text-sm text-paper/70">
                  Send claim/upgrade emails to listings created in the last 6
                  hours
                </p>
              </div>
              <BulkResendRecentButton />
            </div>
          </>
        )}

        {/* Status Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <Link
            href="/dashboard/admin/listings"
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              !statusFilter
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-paper hover:text-paper"
            }`}
          >
            All Listings
            <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
              {allListings.length}
            </span>
          </Link>
          <Link
            href="/dashboard/admin/listings?status=Pending"
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              statusFilter === "Pending"
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-paper hover:text-paper"
            }`}
          >
            Pending Review
            <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded-full">
              {allListings.filter((l) => l.status === "Pending").length}
            </span>
          </Link>
          <Link
            href="/dashboard/admin/listings?status=Live"
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              statusFilter === "Live"
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-paper hover:text-paper"
            }`}
          >
            Live
            <span className="ml-2 text-xs bg-green-100 px-2 py-0.5 rounded-full">
              {allListings.filter((l) => l.status === "Live").length}
            </span>
          </Link>
          <Link
            href="/dashboard/admin/listings?status=Rejected"
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              statusFilter === "Rejected"
                ? "text-brand-blue border-b-2 border-brand-blue"
                : "text-paper hover:text-paper"
            }`}
          >
            Rejected
            <span className="ml-2 text-xs bg-red-100 px-2 py-0.5 rounded-full">
              {allListings.filter((l) => l.status === "Rejected").length}
            </span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sortedListings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Comped Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {sortedListings.filter((l) => l.comped).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pro/Featured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {
                  sortedListings.filter(
                    (l) =>
                      l.featured === true ||
                      l.comped === true ||
                      (l.plan || "").toLowerCase() === "pro" ||
                      (l.plan || "").toLowerCase() === "founding pro",
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                101 Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  sortedListings.filter((l) => l.is_approved_101 === true)
                    .length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedListings.map((listing) => {
                // Determine status pills (max 3)
                const statusPills = [];

                // Status: Live or Pending (only one status pill)
                if (listing.status === "Live") {
                  statusPills.push({
                    text: "Live",
                    color: "green",
                  });
                } else if (listing.status === "Pending") {
                  statusPills.push({
                    text: "Pending",
                    color: "yellow",
                  });
                } else if (listing.status === "Rejected") {
                  statusPills.push({
                    text: "Rejected",
                    color: "red",
                  });
                }

                // Approved badge (renamed from 101 Approved)
                if (
                  listing.is_approved_101 === true &&
                  statusPills.length < 3
                ) {
                  statusPills.push({
                    text: "Approved",
                    color: "blue",
                  });
                }

                // Plan: Pro only (if not already at max) - outline style
                const isPro =
                  listing.comped ||
                  (listing.plan || "").toLowerCase() === "pro" ||
                  (listing.plan || "").toLowerCase() === "founding pro";
                if (isPro && statusPills.length < 3) {
                  statusPills.push({
                    text: "Pro",
                    color: "blue",
                    outline: true,
                  });
                }

                // Determine if Featured
                const isFeatured = listing.featured === true;

                return (
                  <div
                    key={listing.id}
                    className="relative flex items-center gap-6 p-4 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 hover:shadow-lg transition-all"
                  >
                    {/* Featured Star Indicator - Top Left */}
                    {isFeatured && (
                      <div className="absolute left-3 top-3 z-10">
                        <StarIcon className="w-4 h-4 text-brand-orange fill-brand-orange" />
                      </div>
                    )}

                    {/* ZONE 1: Identity (left, dominant) */}
                    <div className="flex-1 min-w-0 pl-6">
                      <Link
                        href={`/listing/${
                          listing.slug ||
                          (
                            listing.listing_name
                              ?.toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/[^a-z0-9-]/g, "")
                          ) ||
                          listing.id
                        }`}
                        className="block group"
                      >
                        <h3 className="text-lg font-semibold text-paper line-clamp-1 group-hover:underline underline-offset-4">
                          {listing.listing_name || "Untitled Listing"}
                        </h3>
                        <p className="text-sm text-neutral-400 mt-0.5 line-clamp-1">
                          {Array.isArray(listing.categories) && listing.categories[0]
                            ? listing.categories[0]
                            : "—"}
                          <span className="mx-2 text-neutral-600">•</span>
                          {[listing.city, listing.state].filter(Boolean).join(", ") || "—"}
                        </p>
                      </Link>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {listing.email || "No email"}
                      </p>
                      {/* Comped text (not a pill) */}
                      {listing.comped && (
                        <p className="text-xs text-neutral-500 mt-1">
                          Comped listing
                        </p>
                      )}
                    </div>

                    {/* ZONE 2: Status (center, calm, grouped) */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {statusPills.map((pill) => {
                        const colorClasses = {
                          green: "bg-green-500/[0.1] text-green-500",
                          yellow: "bg-yellow-500/[0.1] text-yellow-500",
                          red: "bg-red-500/[0.1] text-red-500",
                          blue: pill.outline
                            ? "border border-blue-500/30 text-blue-500 bg-transparent"
                            : "bg-blue-500/[0.1] text-blue-500",
                        };

                        return (
                          <span
                            key={pill.text}
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              pill.outline ? "" : "border-0"
                            } ${colorClasses[pill.color]}`}
                          >
                            {pill.text}
                          </span>
                        );
                      })}
                    </div>

                    {/* ZONE 3: Actions (right, obvious buttons) */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Pending actions */}
                      {listing.status === "Pending" && (
                        <ListingActions
                          listingId={listing.id}
                          listingName={
                            listing.listing_name || "Unnamed Listing"
                          }
                          showApproveReject={true}
                        />
                      )}

                      {/* Comped Toggle */}
                      <CompedToggle
                        listingId={listing.id}
                        isComped={listing.comped || false}
                        currentPlan={listing.plan}
                      />

                      {/* Primary: View */}
                      <Button
                        size="sm"
                        variant="default"
                        asChild
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white font-medium"
                      >
                        <Link
                          href={`/listing/${
                            listing.slug ||
                            (
                              listing.listing_name
                                ?.toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/[^a-z0-9-]/g, "")
                            ) ||
                            listing.id
                          }`}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>

                      {/* Secondary: Edit */}
                      <Button
                        size="sm"
                        variant="secondary"
                        asChild
                        className="bg-neutral-800 hover:bg-neutral-700 text-paper border border-neutral-700"
                      >
                        <Link href={`/dashboard/admin/edit/${listing.id}`}>
                          <EditIcon className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>

                      {/* Utility: View Links */}
                      <ViewClaimLinks
                        listingId={listing.id}
                        listingName={listing.listing_name || "Unnamed Listing"}
                      />

                      {/* Utility: Mockup/Pro */}
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="border-neutral-600 hover:bg-neutral-800 text-neutral-300"
                      >
                        <Link href={`/dashboard/admin/mockup/${listing.id}`}>
                          <Sparkles className="w-4 h-4 mr-1" />
                          Pro
                        </Link>
                      </Button>

                      {/* Destructive: Delete */}
                      <form
                        action={async () => {
                          "use server";
                          await deleteListing(listing.id);
                        }}
                        className="inline"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500"
                        >
                          <Trash2Icon className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                );
              })}

              {sortedListings.length === 0 && (
                <div className="text-center py-8 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 text-ink">
                  No listings found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
