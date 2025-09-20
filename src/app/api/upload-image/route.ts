import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // This API route is disabled since we're using Airtable instead of Sanity
  return NextResponse.json(
    { error: "Image upload is handled through Airtable forms" },
    { status: 501 }
  );
}
