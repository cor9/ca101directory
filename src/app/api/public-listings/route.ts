import { getItems } from "@/data/item-service";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/public-listings
 *
 * Fetches paginated public listings for the directory "Load More" feature.
 *
 * Query params:
 * - page: number (1-indexed, default 1)
 * - q: search query
 * - category: category name filter
 * - state: state filter
 * - region: region filter
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const state = searchParams.get("state") || undefined;
    const region = searchParams.get("region") || undefined;

    const { items, totalCount } = await getItems({
      query: q,
      category,
      state,
      region,
      currentPage: page,
      hasSponsorItem: false,
      excludeFeatured: true,
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const hasMore = page < totalPages;

    return NextResponse.json({
      items,
      totalCount,
      page,
      totalPages,
      hasMore,
    });
  } catch (error) {
    console.error("Error fetching public listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}
