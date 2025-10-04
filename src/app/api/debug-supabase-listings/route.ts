import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all listings from Supabase
    const { data: listings, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch listings from Supabase",
          details: error.message,
        },
        { status: 500 },
      );
    }

    // Get count by status
    const { data: statusCounts, error: statusError } = await supabase
      .from("listings")
      .select("status, active")
      .order("status");

    if (statusError) {
      console.error("Status count error:", statusError);
    }

    // Count by status
    const counts = listings.reduce(
      (acc, listing) => {
        const key = `${listing.status || "null"}_${listing.active ? "active" : "inactive"}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return NextResponse.json({
      total: listings.length,
      listings: listings.slice(0, 5), // Show first 5 listings
      counts,
      sampleStatuses: Array.from(new Set(listings.map((l) => l.status))),
      sampleActive: Array.from(new Set(listings.map((l) => l.active))),
      debug: {
        query: "SELECT * FROM listings ORDER BY created_at DESC",
        environment: {
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      },
    });
  } catch (error) {
    console.error("Debug Supabase listings error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch listings from Supabase",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
