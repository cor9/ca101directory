"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Listing } from "@/data/listings";
import { Pencil } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { VendorEditForm } from "./vendor-edit-form";

export const VendorListingsTable = ({ listings }: { listings: Listing[] }) => {
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "Live":
        return (
          <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
            Live
          </span>
        );
      case "Pending":
        return (
          <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
            Pending Review
          </span>
        );
      case "Draft":
        return (
          <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
            Draft
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full dark:bg-red-900 dark:text-red-300">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
            {status || "N/A"}
          </span>
        );
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">My Listings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Listing Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Date Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {listing.listing_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {getStatusBadge(listing.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {listing.created_at
                      ? new Date(listing.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingListing(listing)}
                      aria-label={`Edit ${listing.listing_name}`}
                    >
                      <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {listings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            You don't have any listings yet.
          </div>
        )}
      </div>

      <Dialog
        open={!!editingListing}
        onOpenChange={(isOpen) => !isOpen && setEditingListing(null)}
      >
        <DialogContent className="max-w-3xl">
          {editingListing && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Listing</DialogTitle>
                <DialogDescription>
                  Make changes to{" "}
                  <span className="font-semibold">
                    {editingListing.listing_name}
                  </span>
                  . Click save when finished.
                </DialogDescription>
              </DialogHeader>
              <VendorEditForm
                listing={editingListing}
                onFinished={() => setEditingListing(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

