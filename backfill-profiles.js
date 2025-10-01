const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: "./env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

async function backfillProfiles() {
  console.log("=== Backfilling Missing Profiles ===");

  try {
    // First, let's check if we can access the profiles table
    const { data: existingProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (profilesError) {
      console.error("❌ Cannot access profiles table:", profilesError.message);
      return;
    }

    console.log("✅ Can access profiles table");

    // Since we can't directly query auth.users, we'll need to do this manually
    // Let's create a simple profile for testing
    console.log("📋 Manual backfill required");
    console.log("");
    console.log("Please run this SQL in your Supabase SQL Editor:");
    console.log("");
    console.log("-- Backfill missing profiles for existing users");
    console.log(
      "INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)",
    );
    console.log("SELECT ");
    console.log("  au.id,");
    console.log("  au.email,");
    console.log(
      "  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,",
    );
    console.log(
      "  COALESCE(au.raw_user_meta_data->>'role', 'parent') as role,",
    );
    console.log("  au.created_at,");
    console.log("  NOW() as updated_at");
    console.log("FROM auth.users au");
    console.log("LEFT JOIN public.profiles p ON au.id = p.id");
    console.log("WHERE p.id IS NULL;");
    console.log("");
    console.log(
      "This will create profile records for all existing users who don't have them.",
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

backfillProfiles();
