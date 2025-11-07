/**
 * Import found emails from CSV back into the listings table
 * Run with: npx tsx scripts/import-found-emails.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface EmailUpdate {
  id: string;
  listingName: string;
  foundEmail: string;
  notes: string;
}

function parseCSV(csvContent: string): EmailUpdate[] {
  const lines = csvContent.split('\n');
  const updates: EmailUpdate[] = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line (handle quoted fields)
    const matches = line.match(/("(?:[^"]|"")*"|[^,]*)/g);
    if (!matches || matches.length < 11) continue;

    const id = matches[0].replace(/^"|"$/g, '');
    const listingName = matches[2].replace(/^"|"$/g, '').replace(/""/g, '"');
    const foundEmail = matches[10].replace(/^"|"$/g, '').trim();
    const notes = matches[11]?.replace(/^"|"$/g, '').replace(/""/g, '"') || '';

    // Only process if email was found
    if (foundEmail && foundEmail !== '' && id && id !== '') {
      updates.push({
        id,
        listingName,
        foundEmail,
        notes
      });
    }
  }

  return updates;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function importFoundEmails() {
  console.log('📧 Importing found emails from CSV...\n');

  try {
    // Read CSV file
    const csvPath = join(process.cwd(), 'listings_without_email.csv');
    let csvContent: string;

    try {
      csvContent = readFileSync(csvPath, 'utf-8');
    } catch (error) {
      console.error('❌ Could not read CSV file:', csvPath);
      console.error('   Make sure you have run export-listings-without-email.ts first');
      return;
    }

    // Parse CSV
    const updates = parseCSV(csvContent);

    if (updates.length === 0) {
      console.log('ℹ️  No emails found in CSV. Make sure to add emails to the "Found Email" column.');
      return;
    }

    console.log(`📊 Found ${updates.length} listings with new email addresses\n`);

    // Validate emails
    const validUpdates = updates.filter(update => validateEmail(update.foundEmail));
    const invalidUpdates = updates.filter(update => !validateEmail(update.foundEmail));

    if (invalidUpdates.length > 0) {
      console.log(`⚠️  Skipping ${invalidUpdates.length} invalid emails:\n`);
      invalidUpdates.forEach(update => {
        console.log(`   - "${update.listingName}": ${update.foundEmail}`);
      });
      console.log('');
    }

    if (validUpdates.length === 0) {
      console.log('❌ No valid emails to import');
      return;
    }

    console.log(`✅ Importing ${validUpdates.length} valid emails...\n`);

    // Update database
    let successCount = 0;
    let errorCount = 0;

    for (const update of validUpdates) {
      try {
        const { error } = await supabase
          .from('listings')
          .update({
            email: update.foundEmail,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id);

        if (error) {
          console.error(`❌ Failed to update "${update.listingName}":`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Updated "${update.listingName}" with ${update.foundEmail}`);
          if (update.notes) {
            console.log(`   Note: ${update.notes}`);
          }
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating "${update.listingName}":`, error);
        errorCount++;
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`   Successfully updated: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Skipped (invalid email): ${invalidUpdates.length}`);
    console.log(`   Total processed: ${updates.length}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the import
importFoundEmails();
