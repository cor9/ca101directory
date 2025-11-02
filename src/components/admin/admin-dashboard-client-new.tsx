"use client";

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
import type { updateListing } from "@/actions/listings";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AdminDashboardProps {
  allListings: Listing[];
  totalUsers: number;
  totalVendors: number;
  totalAdmins: number;
}

export const AdminDashboardClientNew = ({
  allListings,
  totalUsers,
  totalVendors,
  totalAdmins,
}: AdminDashboardProps) => {
  const router = useRouter();
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const handleFinishEditing = (
    result: Awaited<ReturnType<typeof updateListing>>,
  ) => {
    setEditingListing(null);

    if (result.status === "success") {
      toast.success(result.message || "Listing updated successfully.");
      router.refresh();
    } else {
      if (result.message) {
        toast.error(result.message);
      }
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your directory listings and users
          </p>
        </div>

        {/* Stats Grid - REAL DATA */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Listings */}
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Listings
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {allListings.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Review
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                  {pendingListings.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
            {pendingListings.length > 0 && (
              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-orange-600"
                onClick={() => setStatusFilter("Pending")}
              >
                Review now →
              </Button>
            )}
          </div>

          {/* Live */}
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Live Listings
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {liveListings.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          {/* Users */}
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {totalUsers}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totalVendors} vendors, {totalAdmins} admins
            </p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-sm font-medium text-muted-foreground">
              Claimed Listings
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {claimedListings.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {unclaimedListings.length} unclaimed
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-sm font-medium text-muted-foreground">
              Rejected
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {rejectedListings.length}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-sm font-medium text-muted-foreground">
              Quick Actions
            </p>
            <div className="mt-2 space-y-1">
              <a
                href="/dashboard/admin/users"
                className="text-sm text-primary hover:underline block"
              >
                View all users →
              </a>
              <a
                href="/dashboard/admin/create"
                className="text-sm text-primary hover:underline block"
              >
                Create listing →
              </a>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                All Listings
              </h2>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All ({allListings.length})
                </Button>
                <Button
                  variant={statusFilter === "Pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Pending")}
                >
                  Pending ({pendingListings.length})
                </Button>
                <Button
                  variant={statusFilter === "Live" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Live")}
                >
                  Live ({liveListings.length})
                </Button>
                <Button
                  variant={statusFilter === "Rejected" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Rejected")}
                >
                  Rejected ({rejectedListings.length})
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Claimed</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.slice(0, 50).map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">
                      {listing.listing_name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          listing.status === "Live"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : listing.status === "Pending"
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                              : listing.status === "Rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {listing.plan || "Free"}
                    </TableCell>
                    <TableCell>
                      {listing.is_claimed ? (
                        <span className="text-green-600 dark:text-green-400 text-sm">
                          ✓ Yes
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {listing.created_at
                        ? new Date(listing.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingListing(listing)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredListings.length > 50 && (
            <div className="p-4 border-t text-center text-sm text-muted-foreground">
              Showing first 50 of {filteredListings.length} listings
            </div>
          )}

          {filteredListings.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                No listings found with this filter
              </p>
            </div>
          )}
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
    </>
  );
};

