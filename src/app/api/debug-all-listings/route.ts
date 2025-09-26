import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all listings from Airtable (including pending ones)
    const { getAllListings } = await import("@/lib/airtable");
    
    const allListings = await getAllListings();

    const listingsWithSlugs = allListings.map((listing) => ({
      id: listing.id,
      businessName: listing.businessName,
      status: listing.status,
      active: listing.active,
      plan: listing.plan,
      email: listing.email,
      phone: listing.phone,
      website: listing.website,
      categories: listing.categories,
      slug: listing.businessName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));

    return NextResponse.json({
      total: allListings.length,
      listings: listingsWithSlugs,
      debug: {
        filter: "No filter - all records",
        environment: {
          hasApiKey: !!process.env.AIRTABLE_API_KEY,
          hasBaseId: !!process.env.AIRTABLE_BASE_ID,
        },
      },
    });
  } catch (error) {
    console.error("Debug all listings error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch all listings",
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
