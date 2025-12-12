import { createServerClient } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Track listing page views
 * Called when someone views a listing detail page
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { listingId, sessionId } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    const headersList = headers();

    // Get user if authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get request metadata
    const referrer = headersList.get("referer") || null;
    const userAgent = headersList.get("user-agent") || null;
    const forwardedFor = headersList.get("x-forwarded-for") || null;
    const ip = forwardedFor ? forwardedFor.split(",")[0] : null;

    // Insert view record
    const { error } = await supabase.from("listing_views").insert({
      listing_id: listingId,
      user_id: user?.id || null,
      session_id: sessionId || crypto.randomUUID(),
      referrer,
      user_agent: userAgent,
      ip_address: ip,
      viewed_at: new Date().toISOString(),
    });

    if (error) {
      // Ignore duplicate errors (same session viewing multiple times)
      if (error.code === "23505") {
        return NextResponse.json({ success: true, duplicate: true });
      }
      console.error("Error tracking view:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in track-view API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "track-view",
    description: "Tracks listing page views",
  });
}
