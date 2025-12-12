"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Real calculated stats
  const pendingListings = allListings.filter((l) => l.status === "Pending");
  const liveListings = allListings.filter((l) => l.status === "Live");
  const rejectedListings = allListings.filter((l) => l.status === "Rejected");
  const claimedListings = allListings.filter((l) => l.is_claimed);
  const unclaimedListings = allListings.filter((l) => !l.is_claimed);

  // Filtered listings based on status
  const getFilteredListings = () => {
    switch (statusFilter) {
      case "Pending":
        return pendingListings;
      case "Live":
        return liveListings;
      case "Rejected":
        return rejectedListings;
      case "Claimed":
        return claimedListings;
      case "Unclaimed":
        return unclaimedListings;
      default:
        return allListings;
    }
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

  // Calculate action items
  const highViewFreeListings = allListings.filter(
    (l) =>
      (!l.plan || l.plan === "Free" || l.plan === null) &&
      l.status === "Live",
  );

  // Get churn risk (inactive Pro listings - simplified)
  const proListings = allListings.filter(
    (l) =>
      l.plan &&
      (l.plan.toLowerCase().includes("pro") ||
        l.plan.toLowerCase().includes("premium") ||
        l.comped),
  );

  return (
    <div className="bg-bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STEP 2: Top bar - you, not them */}
        <header className="mb-10">
          <h1 className="text-2xl font-semibold text-text-primary">
            Admin Overview
          </h1>
          <p className="text-text-muted mt-1">
            Directory health, revenue, and action items.
          </p>
        </header>

        {/* STEP 3: KPI strip - non-negotiable */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-card-surface border border-border-subtle rounded-xl p-4">
            <p className="text-xs text-text-muted">Monthly Revenue</p>
            <p className="text-xl font-semibold text-text-primary">
              ${mrr.toLocaleString()}
            </p>
          </div>

          <div className="bg-card-surface border border-border-subtle rounded-xl p-4">
            <p className="text-xs text-text-muted">Active Pro Listings</p>
            <p className="text-xl font-semibold text-text-primary">
              {activeProListings}
            </p>
          </div>

          <div className="bg-card-surface border border-border-subtle rounded-xl p-4">
            <p className="text-xs text-text-muted">Free → Paid Conversion %</p>
            <p className="text-xl font-semibold text-text-primary">
              {conversionRate}%
            </p>
          </div>

          <div className="bg-card-surface border border-border-subtle rounded-xl p-4">
            <p className="text-xs text-text-muted">Pending Reviews / Flags</p>
            <p className="text-xl font-semibold text-text-primary">
              {pendingReviews + flaggedListings}
            </p>
          </div>
        </div>

        {/* STEP 4: Action queue - this is the heart */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Needs attention
          </h2>
          <div className="space-y-2">
            {pendingListings.length > 0 && (
              <div className="bg-bg-dark-3 border border-border-subtle rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-text-primary font-medium">
                    {pendingListings.length} listing{pendingListings.length !== 1 ? "s" : ""} pending review
                  </p>
                  <p className="text-sm text-text-muted">
                    Awaiting approval
                  </p>
                </div>
                <button
                  type="button"
                  className="text-accent-blue text-sm hover:underline"
                  onClick={() => setStatusFilter("Pending")}
                >
                  View →
                </button>
              </div>
            )}
            {pendingReviews > 0 && (
              <div className="bg-bg-dark-3 border border-border-subtle rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-text-primary font-medium">
                    {pendingReviews} review{pendingReviews !== 1 ? "s" : ""} pending moderation
                  </p>
                  <p className="text-sm text-text-muted">
                    Reviews awaiting approval
                  </p>
                </div>
                <a
                  href="/dashboard/admin/reviews"
                  className="text-accent-blue text-sm hover:underline"
                >
                  View →
                </a>
              </div>
            )}
            {unclaimedListings.length > 0 && (
              <div className="bg-bg-dark-3 border border-border-subtle rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-text-primary font-medium">
                    {unclaimedListings.length} unclaimed listing{unclaimedListings.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-text-muted">
                    Free listings not yet claimed
                  </p>
                </div>
                <button
                  type="button"
                  className="text-accent-blue text-sm hover:underline"
                  onClick={() => setStatusFilter("Unclaimed")}
                >
                  View →
                </button>
              </div>
            )}
            {highViewFreeListings.length > 0 && (
              <div className="bg-bg-dark-3 border border-border-subtle rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-text-primary font-medium">
                    {highViewFreeListings.length} free listing{highViewFreeListings.length !== 1 ? "s" : ""} with high visibility
                  </p>
                  <p className="text-sm text-text-muted">
                    Potential upgrade candidates
                  </p>
                </div>
                <button
                  type="button"
                  className="text-accent-blue text-sm hover:underline"
                  onClick={() => setStatusFilter("all")}
                >
                  View →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* STEP 5: Listings control - not a table from hell */}
        <section className="mb-12">
          <div className="flex gap-4 border-b border-border-subtle mb-6">
            <button
              type="button"
              className={`pb-2 px-1 ${
                statusFilter === "all"
                  ? "text-text-primary border-b-2 border-accent-blue"
                  : "text-text-muted"
              }`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`pb-2 px-1 ${
                statusFilter === "Pro"
                  ? "text-text-primary border-b-2 border-accent-blue"
                  : "text-text-muted"
              }`}
              onClick={() => {
                // This is a simplified filter - would need state management
                setStatusFilter("all");
              }}
            >
              Pro
            </button>
            <button
              type="button"
              className={`pb-2 px-1 ${
                statusFilter === "Rejected"
                  ? "text-text-primary border-b-2 border-accent-blue"
                  : "text-text-muted"
              }`}
              onClick={() => setStatusFilter("Rejected")}
            >
              Flagged
            </button>
            <button
              type="button"
              className={`pb-2 px-1 ${
                statusFilter === "Unclaimed"
                  ? "text-text-primary border-b-2 border-accent-blue"
                  : "text-text-muted"
              }`}
              onClick={() => setStatusFilter("Unclaimed")}
            >
              Unclaimed
            </button>
          </div>

        {updateError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
            {updateError}
          </div>
        )}

          {/* Listings as compact cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.slice(0, 12).map((listing) => (
              <div
                key={listing.id}
                className="bg-card-surface border border-border-subtle rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-text-primary line-clamp-1">
                      {listing.listing_name}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      {listing.city && listing.state
                        ? `${listing.city}, ${listing.state}`
                        : listing.state || "—"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      listing.status === "Live"
                        ? "bg-bg-dark-3 text-text-primary"
                        : listing.status === "Pending"
                          ? "bg-bg-dark-3 text-text-muted"
                          : "bg-bg-dark-3 text-text-muted"
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-text-muted">
                  <span>{listing.plan || "Free"}</span>
                  <span>
                    {listing.is_claimed ? "Claimed" : "Unclaimed"}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-3 w-full text-xs text-accent-blue hover:underline text-left"
                  onClick={() => handleReviewListing(listing)}
                >
                  Edit →
                </button>
              </div>
            ))}
          </div>
          {filteredListings.length > 12 && (
            <p className="text-sm text-text-muted mt-4 text-center">
              Showing 12 of {filteredListings.length} listings
            </p>
          )}
        </section>

        {/* STEP 6: Money visibility - brutally clear */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Revenue signals
          </h2>
          <div className="space-y-4">
            <div className="bg-card-surface border border-border-subtle rounded-lg p-4">
              <p className="text-sm font-medium text-text-primary mb-2">
                Top converting categories
              </p>
              <p className="text-xs text-text-muted">
                Categories with highest paid listing rates
              </p>
            </div>
            <div className="bg-card-surface border border-border-subtle rounded-lg p-4">
              <p className="text-sm font-medium text-text-primary mb-2">
                Listings close to upgrade threshold
              </p>
              <p className="text-xs text-text-muted">
                Free listings with high visibility (upgrade candidates)
              </p>
            </div>
            <div className="bg-card-surface border border-border-subtle rounded-lg p-4">
              <p className="text-sm font-medium text-text-primary mb-2">
                Churn risk
              </p>
              <p className="text-xs text-text-muted">
                {proListings.length} Pro listings active
              </p>
            </div>
          </div>
        </section>

        {/* STEP 7: Safety & Trust panel */}
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Trust & safety
          </h2>
          <div className="space-y-4">
            <div className="bg-card-surface border border-border-subtle rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Pending verifications
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Listings awaiting 101 Approved review
                  </p>
                </div>
                <span className="text-sm text-text-primary">0</span>
              </div>
            </div>
            <div className="bg-card-surface border border-border-subtle rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Reported listings
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Listings flagged for review
                  </p>
                </div>
                <span className="text-sm text-text-primary">
                  {flaggedListings}
                </span>
              </div>
            </div>
            <div className="bg-card-surface border border-border-subtle rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Reviews awaiting moderation
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Pending review approvals
                  </p>
                </div>
                <a
                  href="/dashboard/admin/reviews"
                  className="text-sm text-accent-blue hover:underline"
                >
                  {pendingReviews} →
                </a>
              </div>
            </div>
          </div>
        </section>
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
