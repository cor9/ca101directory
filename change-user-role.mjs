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

const email = process.argv[2];
const newRole = process.argv[3];

if (!email || !newRole) {
  console.error("Usage: node change-user-role.mjs <email> <new-role>");
  console.error("Valid roles: vendor, parent, admin, guest");
  process.exit(1);
}

const validRoles = ["vendor", "parent", "admin", "guest"];
if (!validRoles.includes(newRole)) {
  console.error(`Invalid role: ${newRole}`);
  console.error("Valid roles:", validRoles.join(", "));
  process.exit(1);
}

console.log(`\nChanging role for: ${email} to: ${newRole}\n`);

// Find user by email
const { data: profiles, error: findError } = await supabase
  .from("profiles")
  .select("*")
  .eq("email", email);

if (findError) {
  console.error("Error finding user:", findError);
  process.exit(1);
}

if (!profiles || profiles.length === 0) {
  console.error("❌ User not found");
  process.exit(1);
}

const profile = profiles[0];
console.log("Found user:");
console.log("  - ID:", profile.id);
console.log("  - Email:", profile.email);
console.log("  - Name:", profile.full_name || profile.name || "Not set");
console.log("  - Current Role:", profile.role);

if (profile.role === newRole) {
  console.log("\n✅ User already has role:", newRole);
  process.exit(0);
}

// Update role
const { data: updated, error: updateError } = await supabase
  .from("profiles")
  .update({ role: newRole, updated_at: new Date().toISOString() })
  .eq("id", profile.id)
  .select()
  .single();

if (updateError) {
  console.error("\n❌ Error updating role:", updateError);
  process.exit(1);
}

console.log("\n✅ Role updated successfully!");
console.log("  - Old Role:", profile.role);
console.log("  - New Role:", updated.role);
console.log("\n");
