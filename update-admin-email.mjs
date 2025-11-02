#!/usr/bin/env node
/**
 * Update admin email to a real address that can receive magic links
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crkrittfvylvbtjetxoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNya3JpdHRmdnlsdmJ0amV0eG9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ5ODM0NywiZXhwIjoyMDc0MDc0MzQ3fQ.0uyFclfdU4HxFgM-kJECsViQGCi-icXb-yYXdutbD3Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAdminEmail() {
  console.log('🔍 Current admin users in profiles table:\n');

  const { data: admins, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('role', 'admin');

  if (error) {
    console.error('❌ Error fetching admins:', error);
    return;
  }

  console.log('Found admin users:');
  admins.forEach((admin, i) => {
    console.log(`  ${i + 1}. ${admin.email} (${admin.full_name || 'No name'}) - ID: ${admin.id}`);
  });

  console.log('\n📝 What\'s your real email address that can receive magic links?');
  console.log('   (This will replace admin@childactor101.com)');
  console.log('\nExample: corey@yourdomain.com\n');
  console.log('Run this script with your email:');
  console.log('  node update-admin-email.mjs your-real-email@domain.com\n');

  // Check if email provided as argument
  const newEmail = process.argv[2];

  if (!newEmail) {
    console.log('❌ No email provided. Please run:');
    console.log('   node update-admin-email.mjs your-email@domain.com\n');
    return;
  }

  // Validate email format
  if (!newEmail.includes('@') || !newEmail.includes('.')) {
    console.log('❌ Invalid email format. Please provide a valid email address.\n');
    return;
  }

  // Find admin@childactor101.com
  const oldAdminEmail = 'admin@childactor101.com';
  const adminToUpdate = admins.find(a => a.email === oldAdminEmail);

  if (!adminToUpdate) {
    console.log(`⚠️  No admin found with email "${oldAdminEmail}"`);
    console.log('   Current admin emails:');
    admins.forEach(a => console.log(`   - ${a.email}`));
    return;
  }

  console.log(`\n🔄 Updating admin email:`);
  console.log(`   From: ${oldAdminEmail}`);
  console.log(`   To:   ${newEmail}\n`);

  // Update in profiles table
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ email: newEmail })
    .eq('id', adminToUpdate.id);

  if (updateError) {
    console.error('❌ Error updating profiles table:', updateError);
    return;
  }

  console.log('✅ Updated profiles table');

  // Now need to update in auth.users table too
  console.log('\n⚠️  IMPORTANT: You also need to update this in Supabase Dashboard:');
  console.log(`   1. Go to: https://supabase.com/dashboard/project/crkrittfvylvbtjetxoa/auth/users`);
  console.log(`   2. Find user ID: ${adminToUpdate.id}`);
  console.log(`   3. Click to edit`);
  console.log(`   4. Change email from "${oldAdminEmail}" to "${newEmail}"`);
  console.log(`   5. Save\n`);

  console.log('OR create a new admin account:');
  console.log(`   1. Go to: https://childactor101.com/auth/register`);
  console.log(`   2. Sign up with: ${newEmail}`);
  console.log(`   3. Select role: Vendor (doesn't matter, we'll change it)`);
  console.log(`   4. Get the magic link and confirm email`);
  console.log(`   5. Run this to make it admin:`);
  console.log(`      node make-user-admin.mjs ${newEmail}\n`);

  console.log('✅ Script complete!\n');
}

updateAdminEmail().catch(console.error);

