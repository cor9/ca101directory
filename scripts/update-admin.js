#!/usr/bin/env node

/**
 * Update Admin User Script
 *
 * This script updates the admin@childactor101.com user to have admin role.
 *
 * Usage: node scripts/update-admin.js
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

async function updateAdminUser() {
  try {
    console.log("🔧 Updating admin@childactor101.com to admin role...");

    const { data: updateData, error: updateError } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("email", "admin@childactor101.com")
      .select()
      .single();

    if (updateError) {
      console.error("❌ Error updating profile:", updateError);
      return;
    }

    console.log("✅ Profile updated:", updateData);
    console.log("\n🎉 Admin user updated successfully!");
    console.log(`📧 Email: admin@childactor101.com`);
    console.log(`🔑 Password: admin123`);
    console.log(
      "\nYou can now log in to the admin dashboard at /dashboard/admin",
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the script
updateAdminUser();
