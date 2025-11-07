/**
 * Script to resend "listing live" emails to listings that were updated with emails on November 6, 2025
 * Run with: tsx scripts/resend-emails-to-new-listings.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { sendListingLiveEmail } from '../src/lib/mail';
import { createClaimToken, createOptOutToken } from '../src/lib/tokens';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://directory.childactor101.com';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function generateSlug(listingName: string): string {
  return listingName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function sendEmailToListing(listing: {
  id: string;
  listing_name: string;
  email: string;
  slug: string | null;
}) {
  const email = listing.email.trim();
  if (!email) {
    return { success: false, message: 'No email address' };
  }

  const slug = listing.slug || generateSlug(listing.listing_name);
  const claimUrl = `${siteUrl}/claim/${encodeURIComponent(createClaimToken(listing.id))}?lid=${encodeURIComponent(listing.id)}`;
  const upgradeUrl = `${siteUrl}/claim-upgrade/${encodeURIComponent(slug)}?lid=${encodeURIComponent(listing.id)}&utm_source=email&utm_medium=listing_live`;
  const manageUrl = `${siteUrl}/dashboard/vendor?lid=${encodeURIComponent(listing.id)}`;
  const optOutUrl = `${siteUrl}/remove/${encodeURIComponent(createOptOutToken(listing.id))}?lid=${encodeURIComponent(listing.id)}`;

  try {
    await sendListingLiveEmail({
      vendorName: listing.listing_name,
      vendorEmail: email,
      listingName: listing.listing_name,
      slug,
      listingId: listing.id,
      claimUrl,
      upgradeUrl,
      manageUrl,
      optOutUrl,
    });

    return { success: true };
  } catch (error: any) {
    console.error(`  Error: ${error.message}`);
    return { success: false, message: error.message };
  }
}

async function resendEmailsToNewListings() {
  console.log('Fetching listings updated on November 6, 2025 with emails...\n');

  // Get listings updated on November 6, 2025 (when emails were actually found)
  const { data: fullListings, error: fullError } = await supabase
    .from('listings')
    .select('id, listing_name, email, slug, categories, updated_at')
    .not('email', 'is', null)
    .neq('email', '')
    .gte('updated_at', '2025-11-06 00:00:00')
    .lt('updated_at', '2025-11-07 00:00:00')
    .order('listing_name');

  if (fullError) {
    console.error('Error fetching full listings:', fullError);
    return;
  }

  const targetListings = (fullListings || []).filter(listing => {
    if (!listing.categories || !Array.isArray(listing.categories)) {
      return true;
    }
    return !listing.categories.includes('Talent Agents') &&
           !listing.categories.includes('Talent Managers');
  });

  console.log(`Found ${targetListings.length} listings to send emails to.\n`);

  const results = {
    sent: 0,
    failed: 0,
    skipped: 0,
  };

  // Send emails
  for (let i = 0; i < targetListings.length; i++) {
    const listing = targetListings[i];
    const email = listing.email?.trim();

    if (!email) {
      console.log(`[${i + 1}/${targetListings.length}] ${listing.listing_name}`);
      console.log('  Skipped: No email');
      results.skipped++;
      continue;
    }

    console.log(`[${i + 1}/${targetListings.length}] ${listing.listing_name}`);
    console.log(`  Email: ${email}`);

    const result = await sendEmailToListing({
      id: listing.id,
      listing_name: listing.listing_name || '',
      email,
      slug: listing.slug || null,
    });

    if (result.success) {
      console.log(`  ✓ Email sent successfully`);
      results.sent++;
    } else {
      console.log(`  ✗ Failed: ${result.message}`);
      results.failed++;
    }

    // Be nice - wait a bit between emails
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('');
  }

  console.log('\n=== Summary ===');
  console.log(`Total listings processed: ${targetListings.length}`);
  console.log(`Emails sent: ${results.sent}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Skipped: ${results.skipped}`);
}

resendEmailsToNewListings()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

