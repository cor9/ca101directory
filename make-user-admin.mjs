#!/usr/bin/env node
/**
 * Make any user an admin by email address
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crkrittfvylvbtjetxoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNya3JpdHRmdnlsdmJ0amV0eG9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ5ODM0NywiZXhwIjoyMDc0MDc0MzQ3fQ.0uyFclfdU4HxFgM-kJECsViQGCi-icXb-yYXdutbD3Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeUserAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.log('❌ No email provided. Please run:');
    console.log('   node make-user-admin.mjs your-email@domain.com\n');
    return;
  }

  console.log(`🔍 Looking for user: ${email}\n`);

  // Find user in profiles
  const { data: user, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('email', email)
    .single();

  if (error || !user) {
    console.log('❌ User not found in profiles table.');
    console.log('   Make sure they have signed up first.\n');
    return;
  }

  console.log('Found user:');
  console.log(`  Email: ${user.email}`);
  console.log(`  Name: ${user.full_name || 'Not set'}`);
  console.log(`  Current Role: ${user.role}`);
  console.log(`  ID: ${user.id}\n`);

  if (user.role === 'admin') {
    console.log('✅ User is already an admin!\n');
    return;
  }

  console.log('🔄 Updating role to admin...\n');

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', user.id);

  if (updateError) {
    console.error('❌ Error updating role:', updateError);
    return;
  }

  console.log('✅ SUCCESS! User is now an admin.\n');
  console.log('Next steps:');
  console.log(`  1. Go to: https://childactor101.com/auth/login`);
  console.log(`  2. Enter: ${email}`);
  console.log(`  3. Click "Send me a login link"`);
  console.log(`  4. Check your email for the magic link`);
  console.log(`  5. Click the link → You'll land on admin dashboard!\n`);
}

makeUserAdmin().catch(console.error);

