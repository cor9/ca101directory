import Airtable from "airtable";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;

    if (!apiKey || !baseId) {
      return NextResponse.json(
        { error: "Missing Airtable configuration" },
        { status: 500 },
      );
    }

    const airtable = new Airtable({
      apiKey,
    });

    const base = airtable.base(baseId);

    const records = await base("Listings")
      .select({
        fields: ["Listing Name", "Email", "Phone", "Website", "Status", "Plan"],
      })
      .all();

    return NextResponse.json({
      total: records.length,
      records: records.map((record) => ({
        id: record.id,
        fields: record.fields,
      })),
    });
  } catch (error) {
    console.error("Simple Airtable test error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Airtable records",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
