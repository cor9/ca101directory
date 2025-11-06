/**
 * Script to clean malformed listings with URLs and HTML in text fields
 * Run with: npx tsx scripts/clean-malformed-listings.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// List of IDs to clean (from the query results)
const malformedListingIds = [
  "f044cf7a-57cb-4b65-a235-4b71fcc3fc4f", // Book From Tape
  "083fb87a-29b5-42f5-9aef-290f42dfbbb1", // CCC Acting Studio
  "a20166b7-a56b-463f-b38e-690b9e586502", // The Christiansen Acting Academy
  "0ed13c4a-6887-465c-bfdf-d592f08de39d", // Young Actors Space
  "1d4853aa-27b5-47dc-a9e1-7ce4c8d32fb1", // 3-2-1 Acting Studios
  "97735220-6d93-42f9-84a5-adeb0ba53bfd", // Actors Youth Academy
  "cc384626-0802-475a-94f0-f5cb80525583", // Align Public Relations
  "566da08d-6bd1-47c1-8d5d-e3f9e0e4c08b", // Anderson Group Public Relations
  "9919f647-fe51-4024-8885-211d6513bd84", // Ayers Publicity
  "a077f670-fa3b-4c9a-bfe7-2502bd81ff88", // Deena Freeman Kids & Teens Acting Studio
  "701a16ed-5178-4c89-89c4-4858b9a2a4c5", // EKC PR
  "dc92d4bb-4d7c-4ca8-8878-59234bdf0790", // Empyrean PR & Productions
  "d139854b-304d-4516-8167-6298a541c633", // Giovannie Espiritu
  "3f031016-a053-4bbf-9f31-2a8e0cc47fde", // Gloria Garayua
  "c09d4e43-84cb-405c-bbb2-c5ea05a147d2", // Holly Gagnier
  "b16fab73-3191-4522-94a6-496ec42dd86b", // Howard Fine Acting Studio
  "0b078937-6bb8-4f2b-acfd-c9db431a3a83", // Jill Fritzo Public Relations
  "0f386e73-f1fe-4df5-acc5-dbbfc1cfe0a1", // John D'Aquino's Actors Workshop
  "440a2372-a6c1-4745-b900-e7001d1dcf31", // Keep It Real Acting Studios
  "4a4a66e6-df55-4539-8eb0-0f121b4cab7d", // Khait & Co.
  "4616072d-3a55-45ac-929c-c44788f2f7b8", // LA Acting Studios
  "67f1fd73-7c3f-48da-bc1c-16d5dfeef79c", // Marnie Cooper School of Acting
  "a54403dc-f719-45cb-95fd-e727cce072dd", // Persona PR
  "678efe59-8587-47d8-a71e-f703718e4c0a", // Press Kitchen
  "06e3386c-b74a-4b30-b868-86094a1aa78c", // Revolver PR
  "4c1d87cd-588c-4a79-a204-0370e15dad5d", // Sanguine PR
  "fff71e06-fe8d-4325-b0f3-a96dc827f597", // Shari Shaw Acting & Performance Studios
  "babc3251-6c21-4c30-b5e6-e14ac04b9967", // The Initiative Group
  "65533550-7c42-4883-bd88-f4407fe1a2e3", // Turk PR
  "0f7e19c9-9b3f-4a58-9080-ca7cd3cccc80", // Tyler Barnett Public Relations
  "65516b0e-54bd-40f3-b958-90072cc0a729", // Valerie Allen Public Relations
  "63fc8bc5-1d91-499c-8053-947b5d186d0c", // Young Actor's Studio
  "a502a0eb-21af-4c16-b71c-c61610d4fe7c", // Young Actors Workspace
  "171613e3-d2be-4ebc-88a9-c2a90cbb5e8b", // Zak Barnett Studios
  "1226038b-5a08-4fa6-bd5d-8e3fcd16a4b4", // Clare Lopez
  "8f702a4f-1124-49c6-af8c-610fe2d687f1", // Coaching with Corey
];

function cleanText(text: string | null): string | null {
  if (!text) return null;

  let cleaned = text;

  // Remove HTML tags
  cleaned = cleaned.replace(/<\/?p>/gi, '');
  cleaned = cleaned.replace(/<br\s*\/?>/gi, ' ');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&nbsp;/g, ' ');

  // Remove URLs and everything after them
  // This regex finds http:// or https:// and removes everything from that point
  cleaned = cleaned.replace(/https?:\/\/.*/gi, '');

  // Remove file:/// URLs (like the Revolver PR one)
  cleaned = cleaned.replace(/file:\/\/\/.*/gi, '');

  // Remove MapQuest URLs specifically
  cleaned = cleaned.replace(/www\.mapquest\.com.*/gi, '');

  // Remove URL fragments
  cleaned = cleaned.replace(/#:~:text=.*/gi, '');

  // Clean up multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Trim
  cleaned = cleaned.trim();

  // Remove trailing punctuation if the text was cut off
  cleaned = cleaned.replace(/[,;:\-–—]+$/, '');

  // Add proper ending if text doesn't end with period
  if (cleaned && !cleaned.match(/[.!?]$/)) {
    cleaned = cleaned + '.';
  }

  return cleaned;
}

async function cleanMalformedListings() {
  console.log(`🧹 Starting cleanup of ${malformedListingIds.length} listings...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const id of malformedListingIds) {
    // Fetch the listing
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('id, listing_name, what_you_offer, description')
      .eq('id', id)
      .single();

    if (fetchError || !listing) {
      console.error(`❌ Error fetching listing ${id}:`, fetchError);
      errorCount++;
      continue;
    }

    const originalText = listing.what_you_offer;
    const cleanedText = cleanText(originalText);

    console.log(`\n📝 ${listing.listing_name}`);
    console.log(`   ID: ${id}`);
    console.log(`   Original: ${originalText?.substring(0, 150)}...`);
    console.log(`   Cleaned:  ${cleanedText?.substring(0, 150)}...`);

    // Update the listing
    const { error: updateError } = await supabase
      .from('listings')
      .update({ what_you_offer: cleanedText })
      .eq('id', id);

    if (updateError) {
      console.error(`   ❌ Error updating: ${updateError.message}`);
      errorCount++;
    } else {
      console.log(`   ✅ Updated successfully`);
      successCount++;
    }
  }

  console.log(`\n\n🎉 Cleanup complete!`);
  console.log(`   ✅ Successfully cleaned: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📊 Total processed: ${malformedListingIds.length}\n`);
}

cleanMalformedListings();
