/**
 * Script to find listings with malformed or weird data
 * Run with: npx tsx scripts/find-malformed-listings.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findMalformedListings() {
  console.log('🔍 Searching for listings with malformed data...\n');

  // Fetch all listings
  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, listing_name, what_you_offer, description, website, email, city, state, status');

  if (error) {
    console.error('Error fetching listings:', error);
    process.exit(1);
  }

  const issues: Array<{
    id: string;
    name: string;
    issue: string;
    field: string;
    value: string;
  }> = [];

  for (const listing of listings || []) {
    // Check for URLs in what_you_offer field
    if (listing.what_you_offer && (
      listing.what_you_offer.includes('http://') ||
      listing.what_you_offer.includes('https://') ||
      listing.what_you_offer.includes('www.')
    )) {
      issues.push({
        id: listing.id,
        name: listing.listing_name || 'Unknown',
        issue: 'URL in what_you_offer field',
        field: 'what_you_offer',
        value: listing.what_you_offer.substring(0, 200)
      });
    }

    // Check for URLs in description field
    if (listing.description && (
      listing.description.includes('http://') ||
      listing.description.includes('https://') ||
      listing.description.includes('www.')
    )) {
      issues.push({
        id: listing.id,
        name: listing.listing_name || 'Unknown',
        issue: 'URL in description field',
        field: 'description',
        value: listing.description.substring(0, 200)
      });
    }

    // Check for very long text without breaks (likely malformed)
    if (listing.what_you_offer && listing.what_you_offer.length > 500) {
      issues.push({
        id: listing.id,
        name: listing.listing_name || 'Unknown',
        issue: 'Extremely long what_you_offer (>500 chars)',
        field: 'what_you_offer',
        value: listing.what_you_offer.substring(0, 200) + '...'
      });
    }

    // Check for mapquest URLs specifically
    if (listing.what_you_offer && listing.what_you_offer.includes('mapquest.com')) {
      issues.push({
        id: listing.id,
        name: listing.listing_name || 'Unknown',
        issue: 'MapQuest URL in what_you_offer',
        field: 'what_you_offer',
        value: listing.what_you_offer.substring(0, 200)
      });
    }

    // Check for HTML/special characters that shouldn't be there
    if (listing.what_you_offer && (
      listing.what_you_offer.includes('<') ||
      listing.what_you_offer.includes('>') ||
      listing.what_you_offer.includes('#:~:text=')
    )) {
      issues.push({
        id: listing.id,
        name: listing.listing_name || 'Unknown',
        issue: 'HTML or special URL fragments in what_you_offer',
        field: 'what_you_offer',
        value: listing.what_you_offer.substring(0, 200)
      });
    }
  }

  // Display results
  console.log(`\n📊 Found ${issues.length} listings with potential issues:\n`);

  const grouped = issues.reduce((acc, issue) => {
    if (!acc[issue.name]) {
      acc[issue.name] = [];
    }
    acc[issue.name].push(issue);
    return acc;
  }, {} as Record<string, typeof issues>);

  for (const [name, listingIssues] of Object.entries(grouped)) {
    console.log(`\n🔴 ${name}`);
    console.log(`   ID: ${listingIssues[0].id}`);
    for (const issue of listingIssues) {
      console.log(`   - ${issue.issue}`);
      console.log(`     Field: ${issue.field}`);
      console.log(`     Value: ${issue.value}`);
    }
  }

  console.log(`\n\n✅ Total listings checked: ${listings?.length || 0}`);
  console.log(`❌ Listings with issues: ${Object.keys(grouped).length}`);
  console.log(`⚠️  Total issues found: ${issues.length}\n`);
}

findMalformedListings();
