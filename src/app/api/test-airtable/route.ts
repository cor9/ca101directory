import { createListing } from "@/lib/airtable";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    console.log("Testing Airtable connection...");

    // Test data - minimal fields for current Airtable schema
    const testData = {
      name: "Test Business",
      link: "https://example.com",
      description: "Test description",
      introduction: "Test introduction",
      unique: "Test unique value",
      format: "In-person" as const,
      notes: "Test notes",
      email: "test@example.com",
      phone: "555-1234",
      city: "Test City",
      state: "CA",
      zip: "90210",
      region: "Los Angeles",
      bondNumber: "12345",
      plan: "Basic" as const,
      performerPermit: false,
      bonded: false,
      categories: [], // Empty for now
      tags: [], // Empty for now
      iconId: undefined,
    };

    console.log("Creating test listing with data:", testData);

    const listingId = await createListing(testData);

    if (listingId) {
      return Response.json({
        success: true,
        message: "Airtable connection successful",
        listingId: listingId,
      });
    } else {
      return Response.json(
        {
          success: false,
          message: "Failed to create listing in Airtable",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Airtable test error:", error);
    return Response.json(
      {
        success: false,
        message: `Airtable test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
