import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * One-time fix to convert old "Active" status to "Live"
 * GET /api/admin/fix-status
 */
export async function GET() {
  try {
    console.log("=== FIXING STATUS VALUES ===");

    const supabase = createServerClient();

    // Get all listings with "Active" status
    const { data: listings, error: fetchError } = await supabase
      .from("listings")
      .select("id, listing_name, status")
      .eq("status", "Active");

    if (fetchError) {
      console.error("Error fetching listings:", fetchError);
      return NextResponse.json(
        {
          success: false,
          error: fetchError.message,
        },
        { status: 500 },
      );
    }

    console.log(`Found ${listings?.length || 0} listings with "Active" status`);

    if (!listings || listings.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No listings with 'Active' status found",
        updated: 0,
      });
    }

    const updates: Array<{ id: string; listing_name: string }> = [];

    // Update each listing to "Live"
    for (const listing of listings) {
      const { error: updateError } = await supabase
        .from("listings")
        .update({ status: "Live" })
        .eq("id", listing.id);

      if (updateError) {
        console.error(`Error updating listing ${listing.id}:`, updateError);
      } else {
        console.log(`✅ Updated ${listing.listing_name}: Active -> Live`);
        updates.push({
          id: listing.id,
          listing_name: listing.listing_name || "Unknown",
        });
      }
    }

    console.log("=== FIX COMPLETE ===");
    console.log(`Updated ${updates.length} listings`);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updates.length} listings from Active to Live`,
      updates,
    });
  } catch (error) {
    console.error("Fix error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
