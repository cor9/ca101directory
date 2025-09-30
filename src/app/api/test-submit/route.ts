import { submit } from "@/actions/submit";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Test submit - received data:", body);

    // Call the submit action directly
    const result = await submit(body);
    console.log("Test submit - result:", result);

    return NextResponse.json({
      success: true,
      result: result,
    });
  } catch (error) {
    console.error("Test submit error:", error);
    return NextResponse.json(
      { error: "Submit test failed", details: error },
      { status: 500 },
    );
  }
}
