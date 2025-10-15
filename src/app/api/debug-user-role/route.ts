import { createServerClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const supabase = createServerClient();
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: profile.id,
      email: profile.email,
      role: profile.role,
    });

  } catch (error) {
    console.error("Error in debug-user-role API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
