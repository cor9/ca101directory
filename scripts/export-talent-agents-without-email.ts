/**
 * Export talent agent listings without email addresses to CSV for email research
 * Run with: npx tsx scripts/export-talent-agents-without-email.ts
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Listing {
  id: string;
  slug: string | null;
  listing_name: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  categories: string[] | null;
  is_active: boolean | null;
  owner_id: string | null;
}

async function exportTalentAgentsWithoutEmail() {
  console.log('🔍 Fetching talent agent listings without email addresses...\n');

  try {
    // Query talent agents without email
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, slug, listing_name, website, email, phone, city, state, categories, is_active, owner_id')
      .or('email.is.null,email.eq.')
      .eq('is_active', true)
      .contains('categories', ['Talent Agents'])
      .order('listing_name');

    if (error) {
      console.error('❌ Error fetching listings:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      if (error.cause) {
        console.error('Error cause:', error.cause);
      }
      return;
    }

    if (!listings || listings.length === 0) {
      console.log('✅ All talent agent listings have email addresses!');
      return;
    }

    console.log(`📊 Found ${listings.length} talent agent listings without email addresses\n`);

    // Convert to simple CSV format for easy research
    const csvHeader = 'ID,Listing Name,Website,City,State,Phone\n';
    const csvRows = listings.map((listing: Listing) => {
      const name = (listing.listing_name || '').replace(/,/g, ' -');
      const website = listing.website || '';
      const city = listing.city || '';
      const state = listing.state || '';
      const phone = listing.phone || '';

      return `${listing.id},${name},${website},${city},${state},${phone}`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    // Write to file
    const outputPath = join(process.cwd(), 'talent_agents_without_email.csv');
    writeFileSync(outputPath, csvContent, 'utf-8');

    console.log(`✅ Exported to: ${outputPath}`);
    console.log(`\n📋 Summary:`);
    console.log(`   Total talent agents without email: ${listings.length}`);

    // Show some stats
    const withWebsite = listings.filter((l: Listing) => l.website).length;
    const withPhone = listings.filter((l: Listing) => l.phone).length;

    console.log(`   - With website: ${withWebsite} (${Math.round(withWebsite/listings.length*100)}%)`);
    console.log(`   - With phone: ${withPhone} (${Math.round(withPhone/listings.length*100)}%)`);

    // Show all listings for research
    console.log(`\n📝 Talent agents to research:\n`);
    listings.forEach((listing: Listing, index: number) => {
      console.log(`${index + 1}. ${listing.listing_name || 'Unknown'}`);
      console.log(`   Website: ${listing.website || 'N/A'}`);
      console.log(`   Phone: ${listing.phone || 'N/A'}`);
      console.log(`   Location: ${listing.city || 'N/A'}, ${listing.state || 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

// Run the export
exportTalentAgentsWithoutEmail();
