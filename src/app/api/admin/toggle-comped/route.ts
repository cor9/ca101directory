import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * API endpoint to toggle comped status for a listing
 * Only accessible by admins
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin (simplified check)
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { listingId, comped } = await request.json();

    if (!listingId || typeof comped !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    // Update the listing
    const updateData: {
      comped: boolean;
      updated_at: string;
      plan?: string;
    } = {
      comped,
      updated_at: new Date().toISOString(),
    };

    // If setting comped to true, also set plan to "Pro"
    if (comped) {
      updateData.plan = "Pro";
    }

    const { data, error } = await supabase
      .from("listings")
      .update(updateData)
      .eq("id", listingId)
      .select()
      .single();

    if (error) {
      console.error("Error updating listing:", error);
      return NextResponse.json(
        { error: "Failed to update listing" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      listing: data,
    });
  } catch (error) {
    console.error("Toggle comped error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
