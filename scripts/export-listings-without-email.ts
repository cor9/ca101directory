/**
 * Export all listings without email addresses to CSV for email research
 * Run with: npx tsx scripts/export-listings-without-email.ts
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

async function exportListingsWithoutEmail() {
  console.log('🔍 Fetching listings without email addresses...\n');

  try {
    // Query listings without email (email is null or empty)
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, slug, listing_name, website, email, phone, city, state, categories, is_active, owner_id')
      .or('email.is.null,email.eq.')
      .eq('is_active', true)
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
      console.log('✅ All listings have email addresses!');
      return;
    }

    console.log(`📊 Found ${listings.length} listings without email addresses\n`);

    // Convert to CSV format
    const csvHeader = 'ID,Slug,Listing Name,Website,Phone,City,State,Categories,Is Active,Owner ID,Found Email,Notes\n';
    const csvRows = listings.map((listing: Listing) => {
      const name = (listing.listing_name || '').replace(/"/g, '""');
      const website = listing.website || '';
      const phone = listing.phone || '';
      const city = listing.city || '';
      const state = listing.state || '';
      const categories = listing.categories ? listing.categories.join('; ') : '';
      const isActive = listing.is_active ? 'Yes' : 'No';
      const ownerId = listing.owner_id || '';

      return `"${listing.id}","${listing.slug || ''}","${name}","${website}","${phone}","${city}","${state}","${categories}","${isActive}","${ownerId}","",""`;
    }).join('\n');

    const csvContent = csvHeader + csvRows;

    // Write to file
    const outputPath = join(process.cwd(), 'listings_without_email.csv');
    writeFileSync(outputPath, csvContent, 'utf-8');

    console.log(`✅ Exported to: ${outputPath}`);
    console.log(`\n📋 Summary:`);
    console.log(`   Total listings without email: ${listings.length}`);

    // Show some stats
    const withWebsite = listings.filter((l: Listing) => l.website).length;
    const withPhone = listings.filter((l: Listing) => l.phone).length;
    const withBoth = listings.filter((l: Listing) => l.website && l.phone).length;

    console.log(`   - With website: ${withWebsite} (${Math.round(withWebsite/listings.length*100)}%)`);
    console.log(`   - With phone: ${withPhone} (${Math.round(withPhone/listings.length*100)}%)`);
    console.log(`   - With both: ${withBoth} (${Math.round(withBoth/listings.length*100)}%)`);

    // Sample listings for manual research
    console.log(`\n📝 Sample listings to research:\n`);
    listings.slice(0, 5).forEach((listing: Listing, index: number) => {
      console.log(`${index + 1}. ${listing.listing_name || 'Unknown'}`);
      console.log(`   Website: ${listing.website || 'N/A'}`);
      console.log(`   Phone: ${listing.phone || 'N/A'}`);
      console.log(`   Location: ${listing.city || 'N/A'}, ${listing.state || 'N/A'}`);
      console.log('');
    });

    console.log(`\n💡 Next steps:`);
    console.log(`   1. Open listings_without_email.csv`);
    console.log(`   2. For each listing:`);
    console.log(`      - Visit their website and look for contact email`);
    console.log(`      - Check WHOIS data for domain owner email`);
    console.log(`      - Search Google for "[business name] email" or "[business name] contact"`);
    console.log(`      - Check social media profiles (LinkedIn, Facebook, Instagram)`);
    console.log(`      - Use Hunter.io or similar tools for email finding`);
    console.log(`      - Check IMDb Pro if they're in entertainment industry`);
    console.log(`   3. Add found emails to "Found Email" column`);
    console.log(`   4. Run import script to update database`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      if (error.cause) {
        console.error('Error cause:', error.cause);
      }
    }
  }
}

// Run the export
exportListingsWithoutEmail();
