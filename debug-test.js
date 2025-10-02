import { createClient } from '@supabase/supabase-js';

// Load environment variables
import 'dotenv/config';

const supabaseUrl = 'https://crkrittfvylvbtjetxoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNya3JpdHRmdnlsdmJ0amV0eG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTgzNDcsImV4cCI6MjA3NDA3NDM0N30.Z68lA8dnUXb0XsJSxHWXEE3DsFkUdgogxGOm2bmYyXA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGetListingBySlug(slug) {
  console.log(`Testing getListingBySlug for slug: ${slug}`);

  // First try to find by generated slug from listing_name
  console.log('Fetching all approved/active listings...');
  const { data: nameData, error: nameError } = await supabase
    .from("listings")
    .select("*")
    .in("status", ["Live", "APPROVED", "Approved"])
    .eq("active", "checked");

  if (nameError) {
    console.error("Error fetching listings:", nameError);
    return;
  }

  console.log(`Found ${nameData?.length || 0} approved/active listings`);
  
  // Find listing where generated slug matches
  const listing = nameData?.find((item) => {
    const generatedSlug =
      item.listing_name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || item.id;
    
    console.log(`Checking: "${item.listing_name}" -> "${generatedSlug}"`);
    
    return generatedSlug === slug;
  });

  if (listing) {
    console.log(`✅ Found listing: ${listing.listing_name} (${listing.id})`);
    return listing;
  } else {
    console.log(`❌ No listing found for slug: ${slug}`);
    return null;
  }
}

// Test the specific case
testGetListingBySlug('bohemia-group-corey-ralston');
