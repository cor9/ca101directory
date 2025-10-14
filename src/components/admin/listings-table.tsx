"use client";

import type { updateListing } from "@/actions/listings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Listing } from "@/data/listings";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminEditForm } from "./admin-edit-form";

// Define the keys we can sort by
type SortableKeys = "listing_name" | "status" | "is_claimed" | "created_at";

// Type alias for updateListing result
type UpdateListingResult = Awaited<ReturnType<typeof updateListing>>;

export const ListingsTable = ({ listings }: { listings: Listing[] }) => {
  const [filters, setFilters] = useState({
    status: "all",
    claimed: "all",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({ key: "created_at", direction: "descending" });

  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const requestSort = (key: SortableKeys) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFinishEditing = (result: UpdateListingResult) => {
    setEditingListing(null);

    if (result.status === "success") {
      toast.success(
        `${result.message} Filters have been reset to show the updated listing.`,
      );
      // Reset filters to default to ensure the updated item is visible
      setFilters({
        status: "all",
        claimed: "all",
      });
    } else {
      // Only show error toast if there's a message
      if (result.message) {
        toast.error(result.message);
      }
    }
  };

  const sortedAndFilteredListings = useMemo(() => {
    let filtered = [...listings];

    // Apply filters
    if (filters.status !== "all") {
      filtered = filtered.filter((l) => l.status === filters.status);
    }
    if (filters.claimed !== "all") {
      const isClaimed = filters.claimed === "claimed";
      filtered = filtered.filter((l) => !!l.is_claimed === isClaimed);
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [listings, filters, sortConfig]);

  const getSortIcon = (key: SortableKeys) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

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
            Pending
          </span>
        );
      case "Draft":
        return (
          <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
            Draft
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
        <h2 className="text-lg font-semibold mb-4">All Listings</h2>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-input focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-background border"
            >
              <option value="all">All Statuses</option>
              <option value="Live">Live</option>
              <option value="Pending">Pending</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="claimed"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Claimed Status
            </label>
            <select
              id="claimed"
              name="claimed"
              value={filters.claimed}
              onChange={handleFilterChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-input focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-background border"
            >
              <option value="all">All</option>
              <option value="claimed">Claimed</option>
              <option value="unclaimed">Unclaimed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  <button
                    type="button"
                    onClick={() => requestSort("listing_name")}
                    className="flex items-center"
                  >
                    Listing Name {getSortIcon("listing_name")}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  <button
                    type="button"
                    onClick={() => requestSort("status")}
                    className="flex items-center"
                  >
                    Status {getSortIcon("status")}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  <button
                    type="button"
                    onClick={() => requestSort("is_claimed")}
                    className="flex items-center"
                  >
                    Claimed {getSortIcon("is_claimed")}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  <button
                    type="button"
                    onClick={() => requestSort("created_at")}
                    className="flex items-center"
                  >
                    Date Created {getSortIcon("created_at")}
                  </button>
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
              {sortedAndFilteredListings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {listing.listing_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {getStatusBadge(listing.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {listing.is_claimed ? "Yes" : "No"}
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
        {sortedAndFilteredListings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No listings match the current filters.
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
