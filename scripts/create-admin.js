#!/usr/bin/env node

/**
 * Create Admin User Script
 *
 * This script creates an admin user in Supabase for the Child Actor 101 Directory.
 *
 * Usage:
 * 1. Make sure your .env.local has the correct Supabase credentials
 * 2. Run: node scripts/create-admin.js
 * 3. Follow the prompts
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: "env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log("🔍 Checking existing users...");

    // Get all users
    const { data: users, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("❌ Error fetching users:", usersError);
      return;
    }

    console.log(`📊 Found ${users.users.length} users:`);
    users.users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.id})`);
    });

    // Check existing profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*");

    if (profilesError) {
      console.error("❌ Error fetching profiles:", profilesError);
      return;
    }

    console.log(`\n📋 Found ${profiles.length} profiles:`);
    profiles.forEach((profile, index) => {
      console.log(`  ${index + 1}. ${profile.email} - Role: ${profile.role}`);
    });

    // Check if admin user exists
    const adminProfile = profiles.find((p) => p.role === "admin");

    if (adminProfile) {
      console.log(`\n✅ Admin user already exists: ${adminProfile.email}`);
      return;
    }

    // Check if admin@childactor101.com exists but with wrong role
    const existingAdminUser = profiles.find(
      (p) => p.email === "admin@childactor101.com",
    );

    if (existingAdminUser) {
      console.log(
        `\n🔧 Updating existing user to admin role: ${existingAdminUser.email}`,
      );

      const { data: updateData, error: updateError } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", existingAdminUser.id)
        .select()
        .single();

      if (updateError) {
        console.error("❌ Error updating profile:", updateError);
        return;
      }

      console.log("✅ Profile updated:", updateData);
      console.log("\n🎉 Admin user updated successfully!");
      console.log(`📧 Email: ${existingAdminUser.email}`);
      console.log(`🔑 Password: admin123`);
      console.log(
        "\nYou can now log in to the admin dashboard at /dashboard/admin",
      );
      return;
    }

    // Create new admin user
    console.log("\n🔧 Creating new admin user...");

    const adminEmail = "admin@childactor101.com";
    const adminPassword = "admin123";

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

    if (authError) {
      console.error("❌ Error creating auth user:", authError);
      return;
    }

    console.log("✅ Auth user created:", authData.user.email);

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: adminEmail,
        full_name: "Admin User",
        role: "admin",
      })
      .select()
      .single();

    if (profileError) {
      console.error("❌ Error creating profile:", profileError);
      return;
    }

    console.log("✅ Profile created:", profileData);
    console.log("\n🎉 Admin user created successfully!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(
      "\nYou can now log in to the admin dashboard at /dashboard/admin",
    );
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the script
createAdminUser();
