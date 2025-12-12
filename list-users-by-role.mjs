#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const targetRole = process.argv[2];

if (!targetRole) {
  console.error("Usage: node list-users-by-role.mjs <role>");
  console.error("Valid roles: vendor, parent, admin, guest");
  process.exit(1);
}

console.log(`\nFinding all users with role: ${targetRole}\n`);

const { data: profiles, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("role", targetRole)
  .order("created_at", { ascending: false });

if (error) {
  console.error("Error fetching users:", error);
  process.exit(1);
}

if (!profiles || profiles.length === 0) {
  console.log(`No users found with role: ${targetRole}`);
  process.exit(0);
}

console.log(`Found ${profiles.length} user(s) with role '${targetRole}':\n`);

profiles.forEach((profile, index) => {
  console.log(`${index + 1}. ${profile.email}`);
  console.log(`   - ID: ${profile.id}`);
  console.log(`   - Name: ${profile.full_name || profile.name || "Not set"}`);
  console.log(`   - Created: ${new Date(profile.created_at).toLocaleString()}`);
  console.log("");
});
