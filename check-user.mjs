#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const email = process.argv[2];
if (!email) {
  console.error('Usage: node check-user.mjs <email>');
  process.exit(1);
}

console.log(`\nChecking user: ${email}\n`);

// Check auth.users
const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
if (authError) {
  console.error('Error fetching auth users:', authError);
  process.exit(1);
}

const authUser = authUsers.users.find(u => u.email === email);

if (!authUser) {
  console.log('❌ User NOT found in auth.users');
  console.log('\nSuggestion: User needs to register an account first.');
  process.exit(0);
}

console.log('✅ User found in auth.users:');
console.log('  - ID:', authUser.id);
console.log('  - Email:', authUser.email);
console.log('  - Email Confirmed:', authUser.email_confirmed_at ? '✅ Yes' : '❌ No');
console.log('  - Created:', new Date(authUser.created_at).toLocaleString());
console.log('  - Last Sign In:', authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at).toLocaleString() : 'Never');

// Check profiles table
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', authUser.id)
  .single();

console.log('\n📋 Profile in profiles table:');
if (profileError) {
  console.log('❌ Error fetching profile:', profileError.message);
  console.log('\nSuggestion: Profile may be missing. This will cause "Something went wrong" error.');
} else if (!profile) {
  console.log('❌ Profile NOT found');
  console.log('\nSuggestion: Create profile record for this user.');
} else {
  console.log('✅ Profile found:');
  console.log('  - ID:', profile.id);
  console.log('  - Email:', profile.email);
  console.log('  - Name:', profile.full_name || profile.name || 'Not set');
  console.log('  - Role:', profile.role || '❌ NOT SET');
  console.log('  - Created:', new Date(profile.created_at).toLocaleString());
}

console.log('\n🔍 Diagnosis:');
const issues = [];

if (!authUser.email_confirmed_at) {
  issues.push('⚠️  Email not confirmed - User needs to click confirmation link in email');
}

if (!profile) {
  issues.push('❌ Missing profile record - This will cause login to fail');
} else if (!profile.role || profile.role === 'guest') {
  issues.push('❌ No role assigned - User role must be set to vendor/parent/admin');
}

if (issues.length === 0) {
  console.log('✅ No issues found - Login should work');
} else {
  console.log('Issues found:');
  issues.forEach(issue => console.log(`  ${issue}`));
}

console.log('\n');

