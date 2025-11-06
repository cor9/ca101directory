#!/usr/bin/env tsx
/**
 * Script to import background casting agencies from PDF as FREE listings
 * Excludes: Central Casting and Sande Alessi Casting
 * Run with: npx tsx scripts/import-background-casting.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BackgroundCastingAgency {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  website?: string;
  email?: string;
  contact?: string;
}

// Data extracted from PDF (excluding Central Casting and Sande Alessi)
const agencies: BackgroundCastingAgency[] = [
  {
    name: "Dixie Casting",
    address: "4924 Balboa Blvd., Suite 431",
    city: "Encino",
    state: "CA",
    zip: "91316",
    website: "https://www.dixiecasting.com",
  },
  {
    name: "Christopher Gray Casting",
    website: "https://www.christophergraycasting.com",
    contact: "Christopher Gray & Christopher Gonzalez",
    city: "Los Angeles",
    state: "CA",
  },
  {
    name: "Extra Extra Casting",
    address: "2355 Westwood Blvd #728",
    city: "Los Angeles",
    state: "CA",
    zip: "90064",
    website: "https://www.extraextracastings.com",
    email: "info@extraextracasting.com",
  },
  {
    name: "Bill Dance Casting",
    address: "4605 Lankershim Blvd. Suite 219",
    city: "North Hollywood",
    state: "CA",
    zip: "91602",
    phone: "(818) 754-6634",
    website: "https://www.billdancecasting.com",
    contact: "Bill Dance",
  },
  {
    name: "Creative Extras Casting",
    address: "2461 Santa Monica Blvd., #501",
    city: "Santa Monica",
    state: "CA",
    zip: "90404",
    website: "https://www.creativeextrascasting.com",
    email: "talent@creativeextrascasting.com",
    contact: "Vanessa Portillo",
  },
  {
    name: "Headquarters Casting",
    address: "3108 W. Magnolia Blvd.",
    city: "Burbank",
    state: "CA",
    zip: "91505",
    website: "https://www.headquarterscasting.com",
    email: "hqtalent@gmail.com",
    contact: "Carla Lewis",
  },
  {
    name: "Burbank Casting",
    address: "P.O. Box 7106",
    city: "Burbank",
    state: "CA",
    zip: "91510",
    website: "https://www.burbankcasting.com",
    contact: "Michelle or Susan",
  },
  {
    name: "Debe Waisman Casting",
    address: "11684 Ventura Blvd., #415",
    city: "Studio City",
    state: "CA",
    zip: "91604",
    phone: "(310) 535-1325",
    email: "debeatwork@earthlink.net",
    contact: "Debe Waisman",
  },
  {
    name: "Hollywood Talent Associates",
    address: "7825 Fay Ave #200",
    city: "La Jolla",
    state: "CA",
    zip: "92037",
    phone: "858-456-5770",
    city: "San Diego",
    state: "CA",
  },
  {
    name: "Deedee Ricketts Casting",
    address: "8205 Santa Monica Blvd., Suite 1-229",
    city: "West Hollywood",
    state: "CA",
    zip: "90046",
    website: "https://www.deedeecasting.com",
  },
  {
    name: "Idell James Casting",
    address: "15332 Antioch St., PMB 117",
    city: "Pacific Palisades",
    state: "CA",
    zip: "90272",
    phone: "(310) 230-9344",
    email: "ijcphoto@me.com",
  },
  {
    name: "Tower Casting",
    website: "https://towercasting.com",
    email: "tc@towercasting.co",
    contact: "Tyler F. & Christina C.",
    city: "Los Angeles",
    state: "CA",
  },
  {
    name: "Alice Ellis Casting",
    phone: "(310) 314-1488",
    website: "https://www.elliscasting.com",
    email: "submissions@elliscasting.com",
    contact: "Alice Ellis",
    city: "Los Angeles",
    state: "CA",
  },
  {
    name: "Casting Associates",
    address: "1301 Crenshaw Blvd.",
    city: "Torrance",
    state: "CA",
    zip: "90501",
    phone: "(310) 755-6200",
    email: "castingassociates@yahoo.com",
    contact: "Tracy, Joseph & David",
  },
  {
    name: "Jeff Olan Casting",
    address: "14044 Ventura Blvd., Suite 209",
    city: "Sherman Oaks",
    state: "CA",
    zip: "91423",
    phone: "(818) 377-4475",
    website: "https://www.jeffolancasting.com",
    contact: "Jeff Olan",
  },
  {
    name: "JAV Casting",
    email: "JAVCasting@gmail.com",
    phone: "213-866-4515",
    contact: "Jessie Vannatta",
    city: "Los Angeles",
    state: "CA",
  },
  {
    name: "Pete Sutton Casting",
    address: "P.O. Box 56687",
    city: "Sherman Oaks",
    state: "CA",
    zip: "91413",
    email: "petesuttoncasting@maccpro.com",
  },
  {
    name: "Prime Casting",
    address: "201 N. Hollywood Way Suite 208",
    city: "Burbank",
    state: "CA",
    zip: "91505",
    website: "https://www.primecasting.com",
    email: "primecastingdetails@gmail.com",
  },
  {
    name: "Rich King Casting",
    address: "P.O. Box 93506",
    city: "Los Angeles",
    state: "CA",
    zip: "90093",
    phone: "(323) 993-0186",
    website: "https://www.richkingcasting.net",
    email: "submit.richkingcasting@gmail.com",
    contact: "Rich King",
  },
];

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function importBackgroundCasting() {
  console.log("🎬 Importing Background Casting agencies as FREE listings...\n");
  console.log(`📄 Total agencies to import: ${agencies.length}`);
  console.log("⏭️  Excluded: Central Casting, Sande Alessi Casting\n");

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const agency of agencies) {
    const slug = createSlug(agency.name);

    // Check if listing already exists
    const { data: existing } = await supabase
      .from("listings")
      .select("id, listing_name")
      .eq("slug", slug)
      .single();

    if (existing) {
      console.log(`⏭️  Already exists: ${agency.name}`);
      skipped++;
      continue;
    }

    // Prepare listing data
    const listingData = {
      slug,
      listing_name: agency.name,
      website: agency.website || null,
      email: agency.email || null,
      phone: agency.phone || null,
      city: agency.city || null,
      state: agency.state || null,
      zip: agency.zip || null,
      region: agency.state === "CA" ? ["West Coast"] : null,
      categories: ["Background Casting"], // TEXT[] array
      what_you_offer: agency.contact
        ? `Background casting services. Contact: ${agency.contact}`
        : "Background casting services for film and television productions",
      plan: "Free",
      status: "Live",
      is_active: true,
      is_claimed: false,
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log(`📝 Importing: ${agency.name}`);

    const { error } = await supabase.from("listings").insert(listingData);

    if (error) {
      console.error(`❌ Error importing ${agency.name}:`, error.message);
      errors++;
    } else {
      console.log(`✅ Imported: ${agency.name}\n`);
      imported++;
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Import Summary:");
  console.log(`✅ Imported: ${imported} agencies`);
  console.log(`⏭️  Skipped (already exist): ${skipped} agencies`);
  console.log(`❌ Errors: ${errors} agencies`);
  console.log(`📄 Total processed: ${agencies.length} agencies`);
  console.log("=".repeat(60));
}

importBackgroundCasting()
  .then(() => {
    console.log("\n✅ Import complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });

