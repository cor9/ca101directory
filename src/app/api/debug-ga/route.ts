import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const envCheck = {
    GA4_PROPERTY_ID: propertyId ? `✓ set (${propertyId})` : "✗ MISSING",
    GOOGLE_CLIENT_EMAIL: clientEmail ? `✓ set (${clientEmail})` : "✗ MISSING",
    GOOGLE_PRIVATE_KEY: privateKey
      ? `✓ set (starts with: ${privateKey.slice(0, 40)}...)`
      : "✗ MISSING",
  };

  if (!propertyId || !clientEmail || !privateKey) {
    return NextResponse.json({ envCheck, error: "Missing env vars" }, { status: 400 });
  }

  try {
    const client = new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    });

    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      metrics: [{ name: "totalUsers" }],
    });

    return NextResponse.json({
      envCheck,
      success: true,
      rowCount: response.rowCount,
      sample: response.rows?.[0] ?? null,
    });
  } catch (error: any) {
    return NextResponse.json({
      envCheck,
      success: false,
      error: error?.message ?? String(error),
      code: error?.code,
    }, { status: 500 });
  }
}
