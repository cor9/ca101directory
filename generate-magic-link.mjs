import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const email = 'jenn@thehollywoodprep.com';
const siteUrl = 'https://directory.childactor101.com';

// Generate magic link that goes directly to vendor dashboard
const magicLinkUrl = new URL(`${siteUrl}/auth/magic-link`);
magicLinkUrl.searchParams.set('email', email);
magicLinkUrl.searchParams.set('role', 'vendor');
magicLinkUrl.searchParams.set('remember', '1');
magicLinkUrl.searchParams.set('redirectTo', '/dashboard/vendor');
magicLinkUrl.searchParams.set('intent', 'login');

console.log('\n🔗 Generating magic link for Jenn Boyce...\n');

// Create a session that lasts 7 days
const { data, error } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: email,
  options: {
    redirectTo: magicLinkUrl.toString()
  }
});

if (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

console.log('✅ Magic Link Generated!\n');
console.log('📧 ONE-CLICK LOGIN LINK:');
console.log(data.properties.action_link);
console.log('\n⏰ Valid for: 1 hour');
console.log('👤 User: jenn@thehollywoodprep.com');
console.log('🎯 Goes to: Vendor Dashboard\n');

