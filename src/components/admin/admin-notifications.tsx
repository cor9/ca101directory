"use client";

import { Button } from "@/components/ui/button";
import type { Listing } from "@/data/listings";
import { Bell, X } from "lucide-react";

interface AdminNotificationsProps {
  listings: Listing[];
  onReview: (listing: Listing) => void;
}

export const AdminNotifications = ({
  listings,
  onReview,
}: AdminNotificationsProps) => {
  const pendingListings = listings.filter((l) => l.status === "Pending");

  if (pendingListings.length === 0) {
    return null;
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="bg-[#161b22] rounded-lg p-6 border border-gray-700">
      <h2 className="flex items-center text-lg font-semibold mb-4 text-white">
        <Bell className="mr-2 h-5 w-5 text-blue-400" />
        Admin Notifications{" "}
        <span className="ml-2 bg-blue-500/20 text-blue-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          {pendingListings.length}
        </span>
      </h2>
      <div className="space-y-3">
        {pendingListings.slice(0, 5).map((listing) => (
          <div
            key={listing.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-paper/5 rounded-lg"
          >
            <div>
              <p className="font-semibold text-white">{listing.listing_name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 text-xs font-medium text-paper bg-gray-700 rounded-full">
                  {listing.plan || "Free"}
                </span>
                <p className="text-sm text-paper">
                  {formatDate(listing.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
              <Button
                onClick={() => onReview(listing)}
                className="w-full sm:w-auto bg-highlight hover:bg-highlight/90 text-ink font-bold"
              >
                REVIEW
              </Button>
              <Button
                aria-label="Dismiss notification"
                variant="ghost"
                size="icon"
                className="text-paper hover:bg-gray-700 hover:text-white h-9 w-9 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {pendingListings.length > 0 && (
        <div className="mt-6 text-center">
          <Button
            asChild
            className="bg-highlight hover:bg-highlight/90 text-ink font-bold"
          >
            <a href="/dashboard/admin/listings?status=Pending">
              View All {pendingListings.length} Pending Listings
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};