gith"use client";

import type { updateListing } from "@/actions/listings";
import { AdminEditForm } from "@/components/admin/admin-edit-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Listing } from "@/data/listings";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AdminDashboardProps {
  allListings: Listing[];
  totalUsers: number;
  totalVendors: number;
  totalAdmins: number;
  totalListings: number;
  totalReviews: number;
  pendingReviews: number;
  mrr: number;
  activeProListings: number;
  conversionRate: number;
  flaggedListings: number;
}

export const AdminDashboardClientNew = ({
  allListings,
  totalUsers,
  totalVendors,
  totalAdmins,
  totalListings,
  totalReviews,
  pendingReviews,
  mrr,
  activeProListings,
  conversionRate,
  flaggedListings,
}: AdminDashboardProps) => {
  const router = useRouter();
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Real calculated stats
  const pendingListings = allListings.filter((l) => l.status === "Pending");
  const liveListings = allListings.filter((l) => l.status === "Live");
  const rejectedListings = allListings.filter((l) => l.status === "Rejected");
  const claimedListings = allListings.filter((l) => l.is_claimed);
  const unclaimedListings = allListings.filter((l) => !l.is_claimed);
  const flaggedListingsFiltered = allListings.filter(
    (l) => l.status === "Rejected",
  );

  // Calculate Pro listings
  const proListings = allListings.filter(
    (l) =>
      l.plan &&
      (l.plan.toLowerCase().includes("pro") ||
        l.plan.toLowerCase().includes("premium") ||
        l.comped),
  );

  // Filter for analytics (monetization only) - exclude Representation & Regulated
  const monetizableProListings = proListings.filter((l) => {
    const cats = l.categories || [];
    return !cats.some(
      (c) =>
        c.toLowerCase().includes("representation") ||
        c.toLowerCase().includes("regulated"),
    );
  });

  // Calculate high potential listings
  const highViewFreeListings = allListings.filter(
    (l) =>
      (!l.plan || l.plan === "Free" || l.plan === null) && l.status === "Live",
  );

  // Get recently updated listings for Activity Feed
  const recentUpdates = [...allListings]
    .filter((l) => l.updated_at)
    .sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  // Filter logic
  const getFilteredListings = () => {
    let result = allListings;

    // 1. Status Filter
    switch (statusFilter) {
      case "Pending":
        result = pendingListings;
        break;
      case "Live":
        result = liveListings;
        break;
      case "Rejected":
        result = rejectedListings;
        break;
      case "Claimed":
        result = claimedListings;
        break;
      case "Unclaimed":
        result = unclaimedListings;
        break;
      case "pro":
        result = proListings;
        break;
      case "flagged":
        result = flaggedListingsFiltered;
        break;
      case "high_potential":
        result = highViewFreeListings;
        break;
      default:
        result = allListings;
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.listing_name?.toLowerCase().includes(q) ||
          l.city?.toLowerCase().includes(q) ||
          l.state?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q),
      );
    }

    return result;
  };

  const filteredListings = getFilteredListings();

  const handleReviewListing = (listing: Listing) => {
    setUpdateError(null);
    setEditingListing(listing);
  };

  const handleFinishEditing = (
    result: Awaited<ReturnType<typeof updateListing>>,
  ) => {
    setEditingListing(null);

    if (result.status === "success") {
      setUpdateError(null);
      toast.success(result.message || "Listing updated successfully.");
      router.refresh();
    } else {
      const message = result.message || "Failed to update listing.";
      setUpdateError(message);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  return (
    <div className="bg-bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER: Title & Quick Actions */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Admin Overview
            </h1>
            <p className="text-text-muted mt-1">
              Directory health, revenue, and action items.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-9 text-xs"
              onClick={() => toast.info("Exporting user data...")}
            >
              Export Data
            </Button>
            <Button
              type="button"
              className="h-9 text-xs bg-accent-blue hover:bg-accent-blue/90 text-white"
              onClick={() => toast.info("Create listing modal coming soon")}
            >
              + New Listing
            </Button>
          </div>
        </header>

        {/* KPI STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-card-surface border border-border-subtle rounded-xl p-4 relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-xs text-text-muted">Monthly Revenue</p>
              <p className="text-xl font-semibold text-text-primary mt-1">
                ${mrr.toLocaleString()}
              </p>
              <p className="text-[10px] text-green-400 mt-1 flex items-center gap-1">
                <span>↑ 12%</span>
                <span className="text-text-muted/60">vs last month</span>
              </p>
            </div>
            {/* Simple CSS Sparkline Background */}
            <div className="absolute bottom-0 right-0 w-24 h-12 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg
                viewBox="0 0 100 50"
                className="w-full h-full stroke-text-primary fill-none stroke-2"
              >
                <title>Revenue Trend</title>
                <path d="M0 40 Q 25 35 50 20 T 100 5" />
              </svg>
            </div>
          </div>

          <div className="bg-card-surface border border-border-subtle rounded-xl p-4">
            <p className="text-xs text-text-muted">Active Pro Listings</p>
            <p className="text-xl font-semibold text-text-primary mt-1">
              {activeProListings}
            </p>
            <p className="text-[10px] text-text-muted mt-1">
              {monetizableProListings.length} total pro accounts
            </p>
          </div>

          <div className="bg-card-surface border border-border-subtle rounded-xl p-4">
            <p className="text-xs text-text-muted">Free → Paid Conversion</p>
            <p className="text-xl font-semibold text-text-primary mt-1">
              {conversionRate}%
            </p>
            <div className="w-full bg-bg-dark-3 h-1 mt-3 rounded-full overflow-hidden">
              <div
                className="bg-accent-blue h-full rounded-full"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
          </div>

          <div className="bg-card-surface border border-border-subtle rounded-xl p-4">
            <p className="text-xs text-text-muted">Pending Reviews / Flags</p>
            <p className="text-xl font-semibold text-text-primary mt-1">
              {pendingReviews + flaggedListings}
            </p>
            <p className="text-[10px] text-orange-400 mt-1">
              Requires attention
            </p>
          </div>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN (Content) */}
          <div className="lg:col-span-2 space-y-10">
            {/* ACTION QUEUE (Needs Attention) */}
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                Needs attention
                {pendingListings.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </h2>
              <div className="space-y-4">
                {pendingListings.length > 0 && (
                  <button
                    type="button"
                    className="w-full text-left bg-bg-dark-3 border border-border-subtle rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-accent-blue/50 hover:bg-card-hover transition-all group"
                    onClick={() => setStatusFilter("Pending")}
                  >
                    <div>
                      <p className="text-text-primary font-medium">
                        {pendingListings.length} listing
                        {pendingListings.length !== 1 ? "s" : ""} pending review
                      </p>
                      <p className="text-sm text-text-muted">
                        Awaiting approval
                      </p>
                    </div>
                    <span className="text-accent-blue text-sm opacity-100 group-hover:underline">
                      View →
                    </span>
                  </button>
                )}
                {pendingReviews > 0 && (
                  <button
                    type="button"
                    className="w-full text-left bg-bg-dark-3 border border-border-subtle rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-accent-blue/50 hover:bg-card-hover transition-all group"
                    onClick={() => router.push("/dashboard/admin/reviews")}
                  >
                    <div>
                      <p className="text-text-primary font-medium">
                        {pendingReviews} review{pendingReviews !== 1 ? "s" : ""}{" "}
                        pending moderation
                      </p>
                      <p className="text-sm text-text-muted">
                        Reviews awaiting approval
                      </p>
                    </div>
                    <span className="text-accent-blue text-sm opacity-100 group-hover:underline">
                      View →
                    </span>
                  </button>
                )}
                {unclaimedListings.length > 0 && (
                  <button
                    type="button"
                    className="w-full text-left bg-bg-dark-3 border border-border-subtle rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-accent-blue/50 hover:bg-card-hover transition-all group"
                    onClick={() => setStatusFilter("Unclaimed")}
                  >
                    <div>
                      <p className="text-text-primary font-medium">
                        {unclaimedListings.length} unclaimed listing
                        {unclaimedListings.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-text-muted">
                        Free listings not yet claimed
                      </p>
                    </div>
                    <span className="text-accent-blue text-sm opacity-100 group-hover:underline">
                      View →
                    </span>
                  </button>
                )}
                {highViewFreeListings.length > 0 && (
                  <button
                    type="button"
                    className="w-full text-left bg-bg-dark-3 border border-border-subtle rounded-lg p-4 flex justify-between items-center cursor-pointer hover:border-accent-blue/50 hover:bg-card-hover transition-all group"
                    onClick={() => setStatusFilter("high_potential")}
                  >
                    <div>
                      <p className="text-text-primary font-medium">
                        {highViewFreeListings.length} free listing
                        {highViewFreeListings.length !== 1 ? "s" : ""} with high
                        visibility
                      </p>
                      <p className="text-sm text-text-muted">
                        Potential upgrade candidates
                      </p>
                    </div>
                    <span className="text-accent-blue text-sm opacity-100 group-hover:underline">
                      View →
                    </span>
                  </button>
                )}
              </div>
            </section>

            {/* LISTINGS MANAGER */}
            <section>
              {/* Controls Header */}
              <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-border-subtle mb-6 pb-1">
                {/* Tabs */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar w-full sm:w-auto">
                  {[
                    { key: "all", label: "All", count: allListings.length },
                    { key: "pro", label: "Pro", count: proListings.length },
                    {
                      key: "flagged",
                      label: "Flagged",
                      count: flaggedListingsFiltered.length,
                    },
                    {
                      key: "Unclaimed",
                      label: "Unclaimed",
                      count: unclaimedListings.length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setStatusFilter(tab.key)}
                      className={`px-2 pb-3 border-b-2 transition-colors cursor-pointer text-sm whitespace-nowrap ${
                        statusFilter === tab.key
                          ? "border-orange-400 text-text-primary font-medium"
                          : "border-transparent text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64 mb-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-text-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search listings..."
                    className="block w-full pl-10 pr-3 py-1.5 border border-border-subtle rounded-md leading-5 bg-bg-dark-3 text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue sm:text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {updateError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
                  {updateError}
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredListings.slice(0, visibleCount).map((listing, i) => (
                  <div
                    key={listing.id || i}
                    className="bg-card-surface border border-border-subtle rounded-lg p-4 group hover:border-border-muted transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-2">
                        <h3 className="text-sm font-semibold text-text-primary truncate">
                          {listing.listing_name || "Unnamed Listing"}
                        </h3>
                        {/* Listing Metadata */}
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-text-muted">
                          <span>
                            {listing.city && listing.state
                              ? `${listing.city}, ${listing.state}`
                              : listing.state || "Location not set"}
                          </span>
                          <span className="w-1 h-1 bg-text-muted/40 rounded-full" />
                          <span
                            className={
                              listing.plan?.toLowerCase().includes("pro") ||
                              listing.plan?.toLowerCase().includes("premium")
                                ? "text-accent-blue font-medium"
                                : ""
                            }
                          >
                            {listing.plan || "Free"}
                          </span>
                        </div>
                      </div>

                      {/* Status Chip */}
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                          listing.status === "Live"
                            ? "bg-green-400/10 text-green-400 border-green-400/20"
                            : listing.status === "Pending"
                              ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                              : "bg-bg-dark-3 text-text-muted border-border-subtle"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-xs text-text-muted pt-3 border-t border-border-subtle/50">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${listing.is_claimed ? "bg-green-500" : "bg-text-muted/30"}`}
                        />
                        {listing.is_claimed ? "Claimed" : "Unclaimed"}
                      </span>
                      <button
                        type="button"
                        className="text-accent-blue font-medium hover:text-accent-blue-hover hover:underline transition-colors"
                        onClick={() => handleReviewListing(listing)}
                      >
                        Edit →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredListings.length === 0 && (
                <div className="text-center py-12 border border-dashed border-border-subtle rounded-xl">
                  <p className="text-text-muted text-sm">
                    No listings found matching your criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="text-accent-blue text-sm mt-2 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Load More */}
              {filteredListings.length > visibleCount && (
                <div className="mt-8 text-center border-t border-border-subtle pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLoadMore}
                    className="min-w-[200px]"
                  >
                    Load more listings
                  </Button>
                  <p className="text-xs text-text-muted mt-3">
                    Showing {visibleCount} of {filteredListings.length} listings
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN (Sidebar) */}
          <div className="lg:col-span-1 space-y-8">
            {/* REVENUE SIGNALS */}
            <section className="bg-card-surface border border-border-subtle rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark-3/50">
                <h2 className="text-sm font-semibold text-text-primary">
                  Revenue Signals
                </h2>
              </div>
              <div className="divide-y divide-border-subtle">
                <button
                  type="button"
                  onClick={() => toast.info("Category analytics coming soon")}
                  className="w-full text-left p-4 hover:bg-bg-dark-3 transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-accent-blue transition-colors">
                        Top converting categories
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Modeling & Acting leading
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("high_potential")}
                  className={`w-full text-left p-4 hover:bg-bg-dark-3 transition-colors group ${statusFilter === "high_potential" ? "bg-accent-blue/5" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-accent-blue transition-colors">
                        Upgrade Candidates
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {highViewFreeListings.length} hot leads available
                      </p>
                    </div>
                    <span className="text-xs font-semibold bg-bg-dark-3 px-2 py-1 rounded-md border border-border-subtle text-text-primary">
                      {highViewFreeListings.length}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("pro")}
                  className={`w-full text-left p-4 hover:bg-bg-dark-3 transition-colors group ${statusFilter === "pro" ? "bg-accent-blue/5" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-text-primary group-hover:text-accent-blue transition-colors">
                        Churn Risk Monitor
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {monetizableProListings.length} active subscriptions
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* TRUST & SAFETY */}
            <section className="bg-card-surface border border-border-subtle rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark-3/50">
                <h2 className="text-sm font-semibold text-text-primary">
                  Trust & Safety
                </h2>
              </div>
              <div className="divide-y divide-border-subtle">
                <button
                  type="button"
                  onClick={() => setStatusFilter("Pending")}
                  className="w-full text-left p-4 hover:bg-bg-dark-3 transition-colors flex justify-between items-center group"
                >
                  <span className="text-sm group-hover:text-accent-blue transition-colors text-text-primary">
                    Pending Reviews
                  </span>
                  <span className="text-xs font-medium text-text-muted">
                    {pendingListings.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("flagged")}
                  className="w-full text-left p-4 hover:bg-bg-dark-3 transition-colors flex justify-between items-center group"
                >
                  <span className="text-sm group-hover:text-red-400 transition-colors text-text-primary">
                    Flagged Content
                  </span>
                  <span className="text-xs font-medium text-text-muted">
                    {flaggedListings}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/admin/reviews")}
                  className="w-full text-left p-4 hover:bg-bg-dark-3 transition-colors flex justify-between items-center group"
                >
                  <span className="text-sm group-hover:text-accent-blue transition-colors text-text-primary">
                    Review Moderation
                  </span>
                  <span className="text-xs font-medium text-text-muted">
                    {pendingReviews}
                  </span>
                </button>
              </div>
            </section>

            {/* LIVE ACTIVITY FEED */}
            <section className="bg-card-surface border border-border-subtle rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border-subtle bg-bg-dark-3/50 flex justify-between items-center">
                <h2 className="text-sm font-semibold text-text-primary">
                  Recent Activity
                </h2>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
              </div>
              <div className="p-4 space-y-4">
                {recentUpdates.length > 0 ? (
                  recentUpdates.map((listing) => (
                    <div key={listing.id} className="flex gap-3 items-start">
                      <div className="w-2 h-2 mt-1.5 rounded-full bg-border-muted shrink-0" />
                      <div>
                        <p className="text-xs text-text-primary">
                          <span className="font-medium">
                            {listing.listing_name}
                          </span>{" "}
                          was updated
                        </p>
                        <p className="text-[10px] text-text-muted">
                          {listing.updated_at
                            ? new Date(listing.updated_at).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-xs text-text-muted py-2">
                    No recent updates
                  </div>
                )}
                <div className="pt-2 border-t border-border-subtle/50">
                  <p className="text-[10px] text-text-muted text-center">
                    System functional • All systems normal
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingListing}
        onOpenChange={(isOpen) => !isOpen && setEditingListing(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {editingListing && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Listing</DialogTitle>
                <DialogDescription>
                  Make changes to{" "}
                  <span className="font-semibold">
                    {editingListing.listing_name}
                  </span>
                  . Approve, reject, or update details and save when finished.
                </DialogDescription>
              </DialogHeader>
              <AdminEditForm
                listing={editingListing}
                onFinished={handleFinishEditing}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
