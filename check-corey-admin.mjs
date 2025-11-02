#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://crkrittfvylvbtjetxoa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNya3JpdHRmdnlsdmJ0amV0eG9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQ5ODM0NywiZXhwIjoyMDc0MDc0MzQ3fQ.0uyFclfdU4HxFgM-kJECsViQGCi-icXb-yYXdutbD3Q'
);

const { data, error } = await supabase
  .from('profiles')
  .select('email, role')
  .eq('email', 'corey@childactor101.com')
  .single();

if (error || !data) {
  console.log('NO - corey@childactor101.com does NOT exist yet');
  console.log('YOU NEED TO: Go to https://childactor101.com/auth/register and sign up with this email first');
} else {
  console.log(`FOUND: corey@childactor101.com - Role: ${data.role}`);
  if (data.role !== 'admin') {
    console.log('UPDATING TO ADMIN NOW...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', 'corey@childactor101.com');
    console.log(updateError ? 'FAILED' : 'SUCCESS - You are now admin!');
  } else {
    console.log('ALREADY ADMIN - You can login now at https://childactor101.com/auth/login');
  }
}

