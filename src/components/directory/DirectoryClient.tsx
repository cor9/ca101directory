"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { ItemInfo } from "@/types";
import ListingCardClient from "./ListingCardClient";

interface DirectoryClientProps {
  initialItems: ItemInfo[];
  initialTotalCount: number;
  initialTotalPages: number;
}

export default function DirectoryClient({
  initialItems,
  initialTotalCount,
  initialTotalPages,
}: DirectoryClientProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ItemInfo[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages] = useState(initialTotalPages);

  const canLoadMore = page < totalPages;

  const handleLoadMore = useCallback(async () => {
    if (loading || !canLoadMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;

      // Build query string from current search params
      const params = new URLSearchParams();
      params.set("page", String(nextPage));

      const q = searchParams?.get("q");
      const category = searchParams?.get("category");
      const state = searchParams?.get("state");
      const region = searchParams?.get("region");

      if (q) params.set("q", q);
      if (category) params.set("category", category);
      if (state) params.set("state", state);
      if (region) params.set("region", region);

      const response = await fetch(`/api/public-listings?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch more listings");
      }

      const data = await response.json();

      setItems((prev) => [...prev, ...data.items]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more listings:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, canLoadMore, searchParams]);

  return (
    <div>
      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ListingCardClient key={item._id} item={item} />
        ))}
      </div>

      {/* Load More Button */}
      {canLoadMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="rounded-full bg-[#004E89] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#003d6d] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Loading…" : "Load More"}
          </button>
        </div>
      )}

      {/* End of results message */}
      {!canLoadMore && items.length > 0 && (
        <div className="mt-8 text-center text-white/50 text-sm">
          Showing all {initialTotalCount} professionals
        </div>
      )}
    </div>
  );
}

