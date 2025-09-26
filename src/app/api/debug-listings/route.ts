import { getListings } from "@/lib/airtable";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all listings (not just approved ones) for debugging
    const { getListings } = await import("@/lib/airtable");
    const listings = await getListings();

    // Generate slugs for each listing
    const listingsWithSlugs = listings.map((listing) => ({
      id: listing.id,
      businessName: listing.businessName,
      status: listing.status,
      active: listing.active,
      slug: listing.businessName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      url: `/listing/${listing.businessName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")}`,
    }));

    return NextResponse.json({
      total: listings.length,
      listings: listingsWithSlugs,
      debug: {
        filter: "{Status} = 'Approved'",
        environment: {
          hasApiKey: !!process.env.AIRTABLE_API_KEY,
          hasBaseId: !!process.env.AIRTABLE_BASE_ID,
        },
      },
    });
  } catch (error) {
    console.error("Debug listings error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch listings",
        details: error instanceof Error ? error.message : "Unknown error",
        environment: {
          hasApiKey: !!process.env.AIRTABLE_API_KEY,
          hasBaseId: !!process.env.AIRTABLE_BASE_ID,
        },
      },
      { status: 500 },
    );
  }
}
