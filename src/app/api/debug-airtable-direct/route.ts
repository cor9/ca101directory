import { getAllAirtableRecords } from "@/lib/direct-airtable";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const records = await getAllAirtableRecords();

    return NextResponse.json({
      total: records.length,
      records: records,
      debug: {
        message: "Direct Airtable query - all fields",
        environment: {
          hasApiKey: !!process.env.AIRTABLE_API_KEY,
          hasBaseId: !!process.env.AIRTABLE_BASE_ID,
        },
      },
    });
  } catch (error) {
    console.error("Direct Airtable query error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Airtable records",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}





