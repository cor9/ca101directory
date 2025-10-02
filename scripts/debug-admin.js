#!/usr/bin/env node

/**
 * Debug Admin User Script
 *
 * This script checks the admin user's role and session data.
 *
 * Usage: node scripts/debug-admin.js
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: "env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAdminUser() {
  try {
    console.log("🔍 Debugging admin user...");

    // Check all profiles with admin role
    const { data: adminProfiles, error: adminError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "admin");

    if (adminError) {
      console.error("❌ Error fetching admin profiles:", adminError);
      return;
    }

    console.log(`\n📋 Found ${adminProfiles.length} admin profiles:`);
    adminProfiles.forEach((profile, index) => {
      console.log(
        `  ${index + 1}. ${profile.email} - Role: ${profile.role} - ID: ${profile.id}`,
      );
    });

    // Check specific admin user
    const { data: specificAdmin, error: specificError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", "admin@childactor101.com")
      .single();

    if (specificError) {
      console.error("❌ Error fetching specific admin:", specificError);
      return;
    }

    console.log("\n🔍 Specific admin user details:");
    console.log(JSON.stringify(specificAdmin, null, 2));

    // Test login with admin credentials
    console.log("\n🔐 Testing admin login...");

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: "admin@childactor101.com",
        password: "admin123",
      });

    if (authError) {
      console.error("❌ Login failed:", authError);
      return;
    }

    console.log("✅ Login successful!");
    console.log("User ID:", authData.user.id);
    console.log("User Email:", authData.user.email);

    // Get profile for logged in user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("❌ Error fetching profile:", profileError);
      return;
    }

    console.log("\n📋 Profile for logged in user:");
    console.log(JSON.stringify(profile, null, 2));

    // Sign out
    await supabase.auth.signOut();
    console.log("\n✅ Signed out successfully");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the script
debugAdminUser();
