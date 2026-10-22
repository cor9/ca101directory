import { getItems } from "@/data/item-service";
import { DIRECTORY_ITEMS_PER_PAGE } from "@/lib/constants";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/public-listings
 *
 * Paginated public listings. Honors the same filters as /directory, ANDed
 * together (category AND state/city AND ...). `category` may be a name,
 * slug or UUID.
 *
 * Query params:
 * - page: number (1-indexed, default 1)
 * - q, category, state, city, region
 * - online_available: "true"
 * - age_groups: comma separated
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number.parseInt(searchParams.get("page") || "1", 10) || 1,
    );
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const state = searchParams.get("state") || undefined;
    const city = searchParams.get("city") || undefined;
    const region = searchParams.get("region") || undefined;
    const ageGroups = searchParams
      .get("age_groups")
      ?.split(",")
      .filter(Boolean);

    const filtered = Boolean(
      q || (category && category !== "all") || state || city || region,
    );

    const { items, totalCount, itemsPerPage } = await getItems({
      query: q,
      category,
      state,
      city,
      region,
      currentPage: page,
      hasSponsorItem: false,
      // Featured listings only get hoisted above the grid on unfiltered views
      excludeFeatured: !filtered,
      onlineAvailable: searchParams.get("online_available") === "true",
      ageGroups: ageGroups?.length ? ageGroups : undefined,
      itemsPerPage: DIRECTORY_ITEMS_PER_PAGE,
    });

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return NextResponse.json({
      items,
      totalCount,
      page,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error fetching public listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 },
    );
  }
}
