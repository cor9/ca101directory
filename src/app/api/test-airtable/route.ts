import { createListing } from "@/lib/airtable";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    console.log("Testing Airtable connection...");
    
    // Test data - minimal required fields only
    const testData = {
      businessName: "Test Business",
      email: "test@example.com",
      phone: "555-1234",
      website: "https://example.com",
      description: "Test description",
      servicesOffered: "Test services",
      category: [],
      ageRange: [],
      location: "Test City, CA",
      virtual: false,
      plan: "Basic" as const,
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
      return Response.json({
        success: false,
        message: "Failed to create listing in Airtable",
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Airtable test error:", error);
    return Response.json({
      success: false,
      message: `Airtable test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }, { status: 500 });
  }
}
