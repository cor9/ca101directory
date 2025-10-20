"use client";

import type { updateListing } from "@/actions/listings";
import { AdminEditForm } from "@/components/admin/admin-edit-form";
import { AdminNotifications } from "@/components/admin/admin-notifications";
import { EmailVerificationTool } from "@/components/admin/email-verification-tool";
import { ListingsTable } from "@/components/admin/listings-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Listing } from "@/data/listings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminDashboardClientProps {
  allListings: Listing[];
}

export const AdminDashboardClient = ({
  allListings: initialListings,
}: AdminDashboardClientProps) => {
  const router = useRouter();
  const [allListings, setAllListings] = useState(initialListings);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  useEffect(() => {
    setAllListings(initialListings);
  }, [initialListings]);

  const pendingListings = allListings.filter(
    (listing) => listing.status === "Pending",
  );
  const liveListings = allListings.filter(
    (listing) => listing.status === "Live",
  );

  const handleReviewListing = (listing: Listing) => {
    setEditingListing(listing);
  };

  const handleFinishEditing = (
    result: Awaited<ReturnType<typeof updateListing>>,
  ) => {
    setEditingListing(null);

    if (result.status === "success") {
      toast.success(result.message || "Listing updated successfully.");
      // Refresh server-side props to get the latest listings data
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-ink dark:text-foreground mb-2">
            Welcome, Administrator!
          </h1>
          <p className="text-ink dark:text-foreground">
            Manage the platform, moderate content, and oversee all operations
            for Child Actor 101 Directory.
          </p>
        </div>

        {/* Admin Notifications */}
        <AdminNotifications
          listings={allListings}
          onReview={handleReviewListing}
        />

        {/* Email Verification Tool */}
        <EmailVerificationTool />

        {/* Platform Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-paper">Total Users</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">
              {liveListings.length}
            </div>
            <div className="text-sm text-paper">Active Listings</div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">
              {pendingListings.length}
            </div>
            <div className="text-sm text-paper">
              Pending Listings
            </div>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-sm text-paper">Pending Reviews</div>
          </div>
        </div>

        {/* Moderation Queue */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Moderation Queue</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Listing Moderation</h3>
              <div className="text-sm text-paper">
                {pendingListings.length} listings pending approval
              </div>
              <div className="flex gap-2">
                <a
                  href="/dashboard/admin/listings?status=Pending"
                  className="text-sm text-primary hover:underline"
                >
                  Review Listings →
                </a>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Badge Applications</h3>
              <div className="text-sm text-paper">
                Review 101 Approved badge applications
              </div>
              <div className="flex gap-2">
                <a
                  href="/dashboard/admin/badge-applications"
                  className="text-sm text-primary hover:underline"
                >
                  Review Applications →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-medium">Content Management</h3>
              <ul className="text-sm text-paper space-y-1">
                <li>
                  •{" "}
                  <a
                    href="/dashboard/admin/create"
                    className="text-primary hover:underline font-medium"
                  >
                    Create new listing
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/dashboard/admin/listings"
                    className="text-primary hover:underline"
                  >
                    Approve/reject listings
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/dashboard/admin/badge-applications"
                    className="text-primary hover:underline"
                  >
                    Review badge applications
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/dashboard/admin/suggestions"
                    className="text-primary hover:underline"
                  >
                    Review vendor suggestions
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Platform Management</h3>
              <ul className="text-sm text-paper space-y-1">
                <li>
                  •{" "}
                  <a
                    href="/dashboard/admin/users"
                    className="text-primary hover:underline"
                  >
                    Manage users
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/dashboard/admin/analytics"
                    className="text-primary hover:underline"
                  >
                    View analytics
                  </a>
                </li>
                <li>
                  •{" "}
                  <a
                    href="/dashboard/admin/settings"
                    className="text-primary hover:underline"
                  >
                    System settings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* All Listings Table */}
        <ListingsTable listings={allListings} onEdit={handleReviewListing} />
      </div>

      <Dialog
        open={!!editingListing}
        onOpenChange={(isOpen) => !isOpen && setEditingListing(null)}
      >
        <DialogContent className="max-w-3xl">
          {editingListing && (
            <>
              <DialogHeader>
                <DialogTitle>Review Listing</DialogTitle>
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
