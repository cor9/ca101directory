import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all listings from Airtable (including pending ones)
    const { base } = await import("@/lib/airtable");
    
    if (!base) {
      return NextResponse.json({
        error: "Airtable not initialized",
        environment: {
          hasApiKey: !!process.env.AIRTABLE_API_KEY,
          hasBaseId: !!process.env.AIRTABLE_BASE_ID,
        },
      }, { status: 500 });
    }

    const records = await base("Listings")
      .select({
        // No filter - get all records
        sort: [{ field: "Listing Name", direction: "asc" }],
      })
      .all();

    const allListings = records.map((record) => ({
      id: record.id,
      businessName: record.get("Listing Name") || "No Name",
      status: record.get("Status") || "Unknown",
      active: record.get("Active") || false,
      plan: record.get("Plan") || "Unknown",
      email: record.get("Email") || "No Email",
      phone: record.get("Phone") || "No Phone",
      website: record.get("Website") || "No Website",
      categories: record.get("Categories") || [],
      slug: (record.get("Listing Name") || "no-name")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));

    return NextResponse.json({
      total: allListings.length,
      listings: allListings,
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
