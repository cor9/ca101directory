import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all listings from Airtable (including pending ones)
    const { getAllListings } = await import("@/lib/airtable");

    const allListings = await getAllListings();

    // Also get raw Airtable records to see what's actually there
    let rawRecords = [];
    let rawError = null;
    try {
      const { getAllAirtableRecords } = await import("@/lib/direct-airtable");
      rawRecords = await getAllAirtableRecords();
    } catch (error) {
      rawError = error instanceof Error ? error.message : "Unknown error";
      console.error("Raw Airtable query error:", error);
    }

    // Now getAllListings returns processed listings
    const listingsWithSlugs = allListings.map((listing) => ({
      id: listing.id,
      businessName: listing.businessName,
      status: listing.status,
      active: listing.active,
      plan: listing.plan,
      email: listing.email,
      phone: listing.phone,
      website: listing.website,
      description: listing.description,
      uniqueValue: listing.uniqueValue,
      format: listing.format,
      notes: listing.notes,
      categories: listing.categories,
      tags: listing.tags,
      location: listing.location,
      featured: listing.featured,
      approved101: listing.approved101,
      slug: listing.businessName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));

    return NextResponse.json({
      total: allListings.length,
      rawTotal: rawRecords.length,
      rawError: rawError,
      listings: listingsWithSlugs,
      rawRecords: rawRecords.slice(0, 2), // Show first 2 raw records for debugging
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
