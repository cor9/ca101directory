import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const supabase = createServerClient();

    // Check auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin
      .listUsers();

    const user = authUser?.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({
        found: false,
        message: "User not found in auth.users",
      });
    }

    // Check profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      found: true,
      authUser: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      },
      profile: profile
        ? {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            created_at: profile.created_at,
          }
        : null,
      profileError: profileError?.message || null,
      issues: {
        noProfile: !profile,
        noRole: profile && !profile.role,
        emailNotConfirmed: !user.email_confirmed_at,
      },
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      {
        error: "Failed to check user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

