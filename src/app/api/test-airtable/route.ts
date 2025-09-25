import { createListing } from "@/lib/airtable";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    console.log("Testing Airtable connection...");

    // Test data - correct data types for Airtable fields
    const testData = {
      businessName: "Test Business",
      email: "test@example.com",
      phone: "555-1234",
      website: "https://example.com",
      description: "Test description", // Single line text
      servicesOffered: "Test services", // Single line text
      uniqueValue: "Test unique value", // Long text with formatting
      format: "In-person", // Single select
      notes: "Test notes", // Long text with formatting
      city: "Test City", // Long text
      state: "CA", // Long text
      zip: "90210", // Number (will be converted)
      categories: "Acting Classes", // Single select field
      tags: [], // Not implemented yet
      plan: "Basic" as const, // Multiple select (single value)
      featured: false,
      approved101: false,
      status: "Pending" as const,
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
