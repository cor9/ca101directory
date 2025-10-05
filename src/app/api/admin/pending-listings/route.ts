import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    // Fetch pending listings
    const { data, error } = await supabase
      .from("listings")
      .select("id, listing_name, plan, created_at, owner_id")
      .eq("status", "Pending")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching pending listings:", error);
      return NextResponse.json(
        { error: "Failed to fetch pending listings" },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
