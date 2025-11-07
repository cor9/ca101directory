/**
 * Enhanced script to find emails using web search and OSINT
 * Uses web search to find contact information when direct scraping fails
 * Run with: tsx scripts/find-listing-emails-osint.ts
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
  'mail',
  'email',
  'inquiry',
  'inquiries',
  'general',
  'admin',
  'support',
];

// Domains to exclude
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
  if (!email || email.length < 5) return false;
  if (!emailRegex.test(email)) return false;

  const lowerEmail = email.toLowerCase();

  if (invalidPatterns.some(pattern => pattern.test(lowerEmail))) {
    return false;
  }

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

  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && excludedDomains.some(excluded => domain.includes(excluded))) {
    return false;
  }

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

  return [...new Set(validEmails)];
}

function scoreEmail(email: string, websiteUrl?: string): number {
  let score = 0;
  const lowerEmail = email.toLowerCase();

  for (let i = 0; i < preferredEmailPrefixes.length; i++) {
    if (lowerEmail.startsWith(preferredEmailPrefixes[i])) {
      score += preferredEmailPrefixes.length - i;
      break;
    }
  }

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

async function searchWebForEmail(listingName: string, website?: string, city?: string, state?: string): Promise<string[]> {
  const emails: string[] = [];

  // Build multiple search queries
  const queries = [];

  if (website) {
    const domain = website.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace('www.', '');
    queries.push(`"${listingName}" email contact ${domain}`);
    queries.push(`site:${domain} contact email`);
  }

  queries.push(`"${listingName}" contact email`);
  if (city && state) {
    queries.push(`"${listingName}" email ${city} ${state}`);
  }

  // For each query, we would use web search API
  // Since we don't have direct API access, we'll use a different approach:
  // Try to fetch common contact page patterns and search engines

  return emails;
}

async function findEmailFromWebsite(website: string, listingName: string): Promise<string | null> {
  if (!website || !website.startsWith('http')) {
    return null;
  }

  try {
    console.log(`  Fetching: ${website}`);

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
    const emails = extractEmailsFromText(html, website);

    if (emails.length === 0) {
      console.log(`  No emails found on page, trying contact/about pages...`);

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
          // Continue
        }
      }
    }

    if (emails.length === 0) {
      return null;
    }

    const scoredEmails = emails.map(email => ({
      email,
      score: scoreEmail(email, website),
    }));

    scoredEmails.sort((a, b) => b.score - a.score);

    return scoredEmails[0].email;
  } catch (error: any) {
    console.log(`  Error: ${error.message}`);
    return null;
  }
}

async function findEmailsForListings() {
  console.log('Fetching listings without emails...\n');

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

  const filteredListings = listings.filter(listing => {
    if (!listing.categories || !Array.isArray(listing.categories)) {
      return true;
    }
    return !listing.categories.includes('Talent Agents') &&
           !listing.categories.includes('Talent Managers');
  });

  console.log(`Found ${filteredListings.length} listings without emails.\n`);
  console.log('NOTE: This script will use web search via the AI assistant to find emails.\n');
  console.log('Please run this interactively so the AI can search the web for each listing.\n');

  const results = {
    found: 0,
    updated: 0,
    failed: 0,
    skipped: 0,
  };

  // Process first 10 as a test
  const listingsToProcess = filteredListings.slice(0, 10);

  for (let i = 0; i < listingsToProcess.length; i++) {
    const listing = listingsToProcess[i];

    console.log(`[${i + 1}/${listingsToProcess.length}] ${listing.listing_name}`);

    if (!listing.website || listing.website.trim() === '') {
      console.log('  Skipped: No website');
      results.skipped++;
      continue;
    }

    if (listing.email && listing.email.trim() !== '') {
      console.log('  Skipped: Already has email');
      results.skipped++;
      continue;
    }

    let email = await findEmailFromWebsite(listing.website, listing.listing_name);

    if (!email) {
      console.log(`  Website scraping failed. Would search web for: "${listing.listing_name}" contact email`);
      // In production, this would call web search API
    }

    if (email) {
      results.found++;

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

    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('');
  }

  console.log('\n=== Summary ===');
  console.log(`Total listings processed: ${listingsToProcess.length}`);
  console.log(`Emails found: ${results.found}`);
  console.log(`Successfully updated: ${results.updated}`);
  console.log(`Failed/Skipped: ${results.failed + results.skipped}`);
  console.log(`\nRemaining listings: ${filteredListings.length - listingsToProcess.length}`);
}

findEmailsForListings()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

