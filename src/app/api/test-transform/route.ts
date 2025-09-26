import { toAirtable } from "@/lib/airtable";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Test transform - received data:", body);

    // Test the transform using the main function
    const transformed = toAirtable(body);
    console.log("Test transform - result:", transformed);

    return NextResponse.json({
      success: true,
      original: body,
      transformed: transformed,
    });
  } catch (error) {
    console.error("Test transform error:", error);
    return NextResponse.json(
      { error: "Transform test failed", details: error },
      { status: 500 },
    );
  }
}
