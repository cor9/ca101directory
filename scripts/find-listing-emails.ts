/**
 * Script to find emails for listings that don't have them
 * Scrapes websites to find contact emails
 * Run with: tsx scripts/find-listing-emails.ts
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Email regex pattern
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Common email prefixes to look for (in order of preference)
const preferredEmailPrefixes = [
  'info',
  'contact',
  'hello',
  'hello@',
  'mail',
  'email',
  'inquiry',
  'inquiries',
  'general',
  'admin',
  'support',
];

// Domains to exclude (common tracking/analytics emails)
const excludedDomains = [
  'example.com',
  'domain.com',
  'sentry.io',
  'wixpress.com',
  'google-analytics.com',
  'googletagmanager.com',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
  'reddit.com',
];

// Invalid email patterns
const invalidPatterns = [
  /^user@/i,
  /^test@/i,
  /^example@/i,
  /^sample@/i,
  /^placeholder@/i,
  /@example\./i,
  /@domain\./i,
  /@test\./i,
  /@placeholder\./i,
];

function isValidEmail(email: string, websiteUrl?: string): boolean {
  // Basic validation
  if (!email || email.length < 5) return false;

  // Check if it's a valid email format
  if (!emailRegex.test(email)) return false;

  const lowerEmail = email.toLowerCase();

  // Check against invalid patterns
  if (invalidPatterns.some(pattern => pattern.test(lowerEmail))) {
    return false;
  }

  // Exclude common non-contact emails
  if (lowerEmail.includes('noreply') ||
      lowerEmail.includes('no-reply') ||
      lowerEmail.includes('donotreply') ||
      lowerEmail.includes('privacy') ||
      lowerEmail.includes('unsubscribe') ||
      lowerEmail.includes('sentry') ||
      lowerEmail.includes('tracking') ||
      lowerEmail.includes('analytics')) {
    return false;
  }

  // Exclude tracking domains
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && excludedDomains.some(excluded => domain.includes(excluded))) {
    return false;
  }

  // Exclude emails that look like UUIDs or hashes
  const localPart = email.split('@')[0];
  if (localPart && (localPart.length > 32 || /^[a-f0-9]{20,}$/i.test(localPart))) {
    return false;
  }

  return true;
}

function extractEmailsFromText(text: string, websiteUrl?: string): string[] {
  const emails = text.match(emailRegex) || [];
  const validEmails = emails
    .map(email => email.toLowerCase().trim())
    .filter(email => isValidEmail(email, websiteUrl));

  // Remove duplicates
  return [...new Set(validEmails)];
}

function scoreEmail(email: string, websiteUrl?: string): number {
  let score = 0;
  const lowerEmail = email.toLowerCase();

  // Higher score for preferred prefixes
  for (let i = 0; i < preferredEmailPrefixes.length; i++) {
    if (lowerEmail.startsWith(preferredEmailPrefixes[i])) {
      score += preferredEmailPrefixes.length - i;
      break;
    }
  }

  // Higher score if email domain matches website domain
  if (websiteUrl) {
    try {
      const url = new URL(websiteUrl);
      const websiteDomain = url.hostname.replace('www.', '');
      const emailDomain = email.split('@')[1]?.toLowerCase()?.replace('www.', '');

      if (emailDomain && emailDomain === websiteDomain) {
        score += 10;
      }
    } catch (e) {
      // Invalid URL
    }
  }

  return score;
}

async function findEmailFromWebsite(website: string, listingName: string): Promise<string | null> {
  if (!website || !website.startsWith('http')) {
    return null;
  }

  try {
    console.log(`  Fetching: ${website}`);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(website, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.log(`  Status: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract emails from HTML
    const emails = extractEmailsFromText(html, website);

    if (emails.length === 0) {
      console.log(`  No emails found on page, trying contact/about pages...`);

      // Try common contact page URLs
      const contactUrls = [
        `${website}/contact`,
        `${website}/contact-us`,
        `${website}/contact.html`,
        `${website}/about`,
        `${website}/about-us`,
        `${website}/get-in-touch`,
      ];

      for (const contactUrl of contactUrls) {
        try {
          const contactController = new AbortController();
          const contactTimeout = setTimeout(() => contactController.abort(), 5000);

          const contactResponse = await fetch(contactUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            signal: contactController.signal,
          });

          clearTimeout(contactTimeout);

          if (contactResponse.ok) {
            const contactHtml = await contactResponse.text();
            const contactEmails = extractEmailsFromText(contactHtml, website);
            if (contactEmails.length > 0) {
              emails.push(...contactEmails);
              break;
            }
          }
        } catch (e) {
          // Continue to next URL
        }
      }
    }

    if (emails.length === 0) {
      console.log(`  No emails found on website`);
      return null;
    }

    // Score and sort emails
    const scoredEmails = emails.map(email => ({
      email,
      score: scoreEmail(email, website),
    }));

    scoredEmails.sort((a, b) => b.score - a.score);

    const bestEmail = scoredEmails[0].email;
    console.log(`  Found: ${bestEmail} (score: ${scoredEmails[0].score})`);

    return bestEmail;
  } catch (error: any) {
    console.log(`  Error: ${error.message}`);
    return null;
  }
}

async function findEmailViaWebSearch(listingName: string, website?: string, city?: string, state?: string): Promise<string | null> {
  try {
    // Build search query
    let searchQuery = `"${listingName}" contact email`;
    if (city && state) {
      searchQuery += ` ${city} ${state}`;
    } else if (website) {
      const domain = website.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      searchQuery += ` site:${domain}`;
    }

    console.log(`  Searching web: ${searchQuery}`);

    // Use web search to find contact information
    // Note: This would require integrating with a search API
    // For now, we'll return null and log that we'd search here
    // In a real implementation, you'd use Google Custom Search API, Bing API, etc.

    return null;
  } catch (error: any) {
    console.log(`  Search error: ${error.message}`);
    return null;
  }
}

async function findEmailsForListings() {
  console.log('Fetching listings without emails...\n');

  // Get all listings without emails (excluding talent agents/managers)
  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, listing_name, website, email, categories, city, state')
    .or('email.is.null,email.eq.')
    .order('listing_name');

  if (error) {
    console.error('Error fetching listings:', error);
    return;
  }

  if (!listings || listings.length === 0) {
    console.log('No listings found without emails.');
    return;
  }

  // Filter out talent agents and managers
  const filteredListings = listings.filter(listing => {
    if (!listing.categories || !Array.isArray(listing.categories)) {
      return true;
    }
    return !listing.categories.includes('Talent Agents') &&
           !listing.categories.includes('Talent Managers');
  });

  console.log(`Found ${filteredListings.length} listings without emails (after filtering).\n`);

  const results = {
    found: 0,
    updated: 0,
    failed: 0,
    skipped: 0,
  };

  // Process each listing
  for (let i = 0; i < filteredListings.length; i++) {
    const listing = filteredListings[i];

    console.log(`[${i + 1}/${filteredListings.length}] ${listing.listing_name}`);

    // Skip if no website
    if (!listing.website || listing.website.trim() === '') {
      console.log('  Skipped: No website');
      results.skipped++;
      continue;
    }

    // Skip if email already exists
    if (listing.email && listing.email.trim() !== '') {
      console.log('  Skipped: Already has email');
      results.skipped++;
      continue;
    }

    // Try to find email from website first
    let email = await findEmailFromWebsite(listing.website, listing.listing_name);

    // If not found, try web search
    if (!email) {
      email = await findEmailViaWebSearch(
        listing.listing_name,
        listing.website,
        listing.city || undefined,
        listing.state || undefined
      );
    }

    if (email) {
      results.found++;

      // Update the listing
      const { error: updateError } = await supabase
        .from('listings')
        .update({ email })
        .eq('id', listing.id);

      if (updateError) {
        console.error(`  Error updating: ${updateError.message}`);
        results.failed++;
      } else {
        console.log(`  ✓ Updated with email: ${email}`);
        results.updated++;
      }
    } else {
      results.failed++;
    }

    // Be nice - wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('');
  }

  console.log('\n=== Summary ===');
  console.log(`Total listings processed: ${filteredListings.length}`);
  console.log(`Emails found: ${results.found}`);
  console.log(`Successfully updated: ${results.updated}`);
  console.log(`Failed/Skipped: ${results.failed + results.skipped}`);
}

// Run the script
findEmailsForListings()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

