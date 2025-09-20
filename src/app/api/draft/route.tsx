import { NextResponse } from "next/server";

/**
 * Draft mode is disabled since we're using Airtable instead of Sanity
 */
export async function GET(request: Request) {
  return NextResponse.json(
    { error: "Draft mode is not available with Airtable CMS" },
    { status: 501 }
  );
}
