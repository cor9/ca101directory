import { claimListing } from "@/actions/claim-listing";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Free claim used by the claim-upgrade form.
 *
 * Delegates to the same audited claim path as the rest of the site
 * (actions/claim-listing.ts -> performListingClaim) so this route gets the
 * atomic `is_claimed = false` write, vendor-role promotion, claim record and
 * admin notification. It previously wrote owner_id directly and set the
 * listing to "Pending", which pulled a live listing out of the directory and
 * left parent-role claimers without vendor access.
 */
const STATUS_BY_ERROR: Record<string, number> = {
  AUTH_REQUIRED: 401,
  LISTING_NOT_FOUND: 404,
  ALREADY_CLAIMED: 409,
  ALREADY_OWN: 409,
  DUPLICATE_CLAIM: 409,
  UPDATE_FAILED: 409,
};

export async function POST(req: NextRequest) {
  try {
    const { listingId } = (await req.json()) as { listingId?: string };
    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json(
        { error: "listingId required" },
        { status: 400 },
      );
    }

    const result = await claimListing(listingId);
    if (!("error" in result)) {
      return NextResponse.json({ success: true, data: result.listing });
    }
    return NextResponse.json(
      { error: result.message || result.title },
      { status: STATUS_BY_ERROR[result.error] ?? 500 },
    );
  } catch (e) {
    console.error("claim-free error:", e);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
