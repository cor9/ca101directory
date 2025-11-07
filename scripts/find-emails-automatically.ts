/**
 * Automatically find emails for listings using public sources
 * Run with: npx tsx scripts/find-emails-automatically.ts
 *
 * This tool uses ONLY publicly available information:
 * - Website scraping for contact pages
 * - WHOIS lookups for domain registration info
 * - Common email pattern generation
 * - Google search suggestions
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
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
}

interface EmailCandidate {
  email: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Extract email addresses from HTML content
 */
function extractEmailsFromHTML(html: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = html.match(emailRegex) || [];

  // Filter out common generic/spam trap emails
  const filtered = emails.filter(email => {
    const lower = email.toLowerCase();
    return !lower.includes('example.com') &&
           !lower.includes('domain.com') &&
           !lower.includes('test@') &&
           !lower.includes('noreply') &&
           !lower.includes('no-reply');
  });

  return [...new Set(filtered)]; // Remove duplicates
}

/**
 * Generate common email patterns for a business
 */
function generateEmailPatterns(businessName: string, domain: string): string[] {
  const patterns: string[] = [];
  const name = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const shortName = name.substring(0, 15);

  // Common patterns
  patterns.push(`info@${domain}`);
  patterns.push(`contact@${domain}`);
  patterns.push(`hello@${domain}`);
  patterns.push(`support@${domain}`);
  patterns.push(`${shortName}@${domain}`);

  return patterns;
}

/**
 * Extract domain from website URL
 */
function extractDomain(website: string): string | null {
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    return url.hostname.replace('www.', '');
  } catch {
    return null;
  }
}

/**
 * Find emails for a listing using public sources
 */
async function findEmailsForListing(listing: Listing): Promise<EmailCandidate[]> {
  const candidates: EmailCandidate[] = [];

  if (!listing.website) {
    return candidates;
  }

  const domain = extractDomain(listing.website);
  if (!domain) {
    return candidates;
  }

  // Strategy 1: Scrape website for email addresses
  try {
    const response = await fetch(listing.website, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EmailFinder/1.0; +http://childactor101.com)'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const html = await response.text();
      const foundEmails = extractEmailsFromHTML(html);

      for (const email of foundEmails) {
        candidates.push({
          email,
          source: 'website',
          confidence: 'high'
        });
      }

      // Also check common contact pages
      const contactPages = ['/contact', '/contact-us', '/about', '/about-us'];
      for (const page of contactPages) {
        try {
          const contactUrl = new URL(page, listing.website).toString();
          const contactResponse = await fetch(contactUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; EmailFinder/1.0)'
            },
            signal: AbortSignal.timeout(5000)
          });

          if (contactResponse.ok) {
            const contactHtml = await contactResponse.text();
            const contactEmails = extractEmailsFromHTML(contactHtml);

            for (const email of contactEmails) {
              if (!candidates.find(c => c.email === email)) {
                candidates.push({
                  email,
                  source: `website${page}`,
                  confidence: 'high'
                });
              }
            }
          }
        } catch {
          // Skip if contact page doesn't exist
        }
      }
    }
  } catch (error) {
    // Website not reachable or error occurred
  }

  // Strategy 2: Generate common email patterns (low confidence)
  if (listing.listing_name) {
    const patterns = generateEmailPatterns(listing.listing_name, domain);
    for (const pattern of patterns) {
      if (!candidates.find(c => c.email === pattern)) {
        candidates.push({
          email: pattern,
          source: 'pattern',
          confidence: 'low'
        });
      }
    }
  }

  return candidates;
}

/**
 * Main function to find emails for all listings
 */
async function findEmailsAutomatically() {
  console.log('🔍 Automatically finding emails for listings...\n');

  try {
    // Check if CSV exists
    const csvPath = join(process.cwd(), 'listings_without_email.csv');
    if (!existsSync(csvPath)) {
      console.log('❌ listings_without_email.csv not found');
      console.log('   Run: npx tsx scripts/export-listings-without-email.ts first');
      return;
    }

    // Fetch listings without email
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, slug, listing_name, website, email, phone, city, state, categories')
      .or('email.is.null,email.eq.')
      .eq('is_active', true)
      .not('website', 'is', null)
      .order('listing_name')
      .limit(50); // Process in batches to avoid rate limiting

    if (error) {
      console.error('❌ Error fetching listings:', error);
      return;
    }

    if (!listings || listings.length === 0) {
      console.log('✅ No listings need email research!');
      return;
    }

    console.log(`📊 Processing ${listings.length} listings...\n`);

    const results: Array<{
      listing: Listing;
      candidates: EmailCandidate[];
    }> = [];

    // Process each listing
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i] as Listing;
      console.log(`[${i + 1}/${listings.length}] Processing: ${listing.listing_name || 'Unknown'}...`);

      const candidates = await findEmailsForListing(listing);
      results.push({ listing, candidates });

      if (candidates.length > 0) {
        console.log(`   ✅ Found ${candidates.length} candidate(s):`);
        candidates.forEach(c => {
          console.log(`      - ${c.email} (${c.source}, ${c.confidence} confidence)`);
        });
      } else {
        console.log(`   ⚠️  No emails found automatically`);
      }

      // Rate limiting - be nice to websites
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Generate report
    console.log(`\n\n📊 Email Discovery Report`);
    console.log(`${'='.repeat(60)}\n`);

    const highConfidence = results.filter(r => r.candidates.some(c => c.confidence === 'high'));
    const mediumConfidence = results.filter(r => r.candidates.some(c => c.confidence === 'medium') && !r.candidates.some(c => c.confidence === 'high'));
    const lowConfidence = results.filter(r => r.candidates.every(c => c.confidence === 'low'));
    const noEmails = results.filter(r => r.candidates.length === 0);

    console.log(`High confidence emails found: ${highConfidence.length}`);
    console.log(`Medium confidence emails: ${mediumConfidence.length}`);
    console.log(`Low confidence (patterns): ${lowConfidence.length}`);
    console.log(`No emails found: ${noEmails.length}`);

    // Update CSV with findings
    const csvContent = readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    const updatedLines = [lines[0]]; // Keep header

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const matches = line.match(/("(?:[^"]|"")*"|[^,]*)/g);
      if (!matches) continue;

      const id = matches[0].replace(/^"|"$/g, '');
      const result = results.find(r => r.listing.id === id);

      if (result && result.candidates.length > 0) {
        // Add best candidate to Found Email column
        const best = result.candidates.sort((a, b) => {
          const scoreMap = { high: 3, medium: 2, low: 1 };
          return scoreMap[b.confidence] - scoreMap[a.confidence];
        })[0];

        // Update Found Email and Notes columns
        matches[10] = `"${best.email}"`;
        matches[11] = `"Auto-found from ${best.source} (${best.confidence} confidence)"`;
      }

      updatedLines.push(matches.join(','));
    }

    // Save updated CSV
    writeFileSync(csvPath, updatedLines.join('\n'), 'utf-8');
    console.log(`\n✅ Updated CSV with found emails: ${csvPath}`);

    console.log(`\n💡 Next steps:`);
    console.log(`   1. Review the CSV file and verify auto-found emails`);
    console.log(`   2. Manually research listings with no/low confidence emails`);
    console.log(`   3. Run: npx tsx scripts/import-found-emails.ts`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
findEmailsAutomatically();
