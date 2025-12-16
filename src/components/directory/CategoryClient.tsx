"use client";

import type { ItemInfo } from "@/types";
import { useCallback, useState } from "react";
import ListingCardClient from "./ListingCardClient";

interface CategoryClientProps {
  initialItems: ItemInfo[];
  initialTotalCount: number;
  initialTotalPages: number;
  categoryName: string; // Category name for pagination
}

export default function CategoryClient({
  initialItems,
  initialTotalCount,
  initialTotalPages,
  categoryName,
}: CategoryClientProps) {
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

      // Build query string with category
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("category", categoryName);

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
  }, [page, loading, canLoadMore, categoryName]);

  return (
    <div>
      {/* EXACT SAME grid system as directory */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

