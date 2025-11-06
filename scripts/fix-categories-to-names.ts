#!/usr/bin/env tsx
/**
 * Script to fix categories in the listings table
 * Converts category UUIDs back to category names (text array)
 * Run with: npx tsx scripts/fix-categories-to-names.ts
 */

import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixCategoriesToNames() {
  console.log("🔧 Converting category UUIDs to category names (TEXT[])...\n");

  // 1. Get all categories to build a UUID-to-name map
  console.log("1️⃣ Building category UUID-to-name map...");
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("id, category_name, name");

  if (categoriesError) {
    console.error("❌ Error fetching categories:", categoriesError);
    process.exit(1);
  }

  const uuidToNameMap = new Map<string, string>();
  categoriesData?.forEach((cat: any) => {
    const name = cat.category_name || cat.name;
    if (name && cat.id) {
      uuidToNameMap.set(cat.id.toLowerCase(), name);
    }
  });

  console.log(`✅ Built map with ${uuidToNameMap.size} categories\n`);

  // 2. Get all listings with categories
  console.log("2️⃣ Fetching all listings with categories...");
  const { data: listingsData, error: listingsError } = await supabase
    .from("listings")
    .select("id, listing_name, categories")
    .not("categories", "is", null);

  if (listingsError) {
    console.error("❌ Error fetching listings:", listingsError);
    process.exit(1);
  }

  console.log(
    `✅ Found ${listingsData?.length || 0} listings with categories\n`,
  );

  // 3. Process each listing
  let fixed = 0;
  let alreadyCorrect = 0;
  let errors = 0;

  console.log("3️⃣ Processing listings...\n");

  for (const listing of listingsData || []) {
    const categories = listing.categories;

    if (!Array.isArray(categories)) {
      console.log(
        `⚠️  Skipping ${listing.listing_name}: categories is not an array`,
      );
      continue;
    }

    if (categories.length === 0) {
      console.log(
        `⚠️  Skipping ${listing.listing_name}: empty categories array`,
      );
      continue;
    }

    // Check if all categories are already names (not UUIDs)
    const allNames = categories.every(
      (cat: any) =>
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          String(cat),
        ),
    );

    if (allNames) {
      alreadyCorrect++;
      continue;
    }

    // Convert UUIDs to category names
    const fixedCategories: string[] = [];
    const unmappedUUIDs: string[] = [];

    for (const cat of categories) {
      const catStr = String(cat);
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          catStr,
        );

      if (isUUID) {
        // Map UUID to name
        const name = uuidToNameMap.get(catStr.toLowerCase());
        if (name) {
          fixedCategories.push(name);
        } else {
          unmappedUUIDs.push(catStr);
        }
      } else {
        // Already a name, keep it
        fixedCategories.push(catStr);
      }
    }

    if (unmappedUUIDs.length > 0) {
      console.log(
        `⚠️  ${listing.listing_name}: Could not map UUIDs: ${unmappedUUIDs.join(", ")}`,
      );
    }

    if (fixedCategories.length === 0) {
      console.log(
        `⚠️  ${listing.listing_name}: No valid categories after conversion, skipping`,
      );
      continue;
    }

    // Remove duplicates
    const uniqueCategories = Array.from(new Set(fixedCategories));

    console.log(`🔄 Fixing ${listing.listing_name}:`);
    console.log(`   Before: ${JSON.stringify(categories)}`);
    console.log(`   After:  ${JSON.stringify(uniqueCategories)}`);

    // Update the listing
    const { error: updateError } = await supabase
      .from("listings")
      .update({ categories: uniqueCategories })
      .eq("id", listing.id);

    if (updateError) {
      console.error(`❌ Error updating ${listing.listing_name}:`, updateError);
      errors++;
    } else {
      console.log(`✅ Fixed!\n`);
      fixed++;
    }
  }

  // 4. Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Summary:");
  console.log(`✅ Fixed: ${fixed} listings`);
  console.log(`✓  Already correct: ${alreadyCorrect} listings`);
  console.log(`❌ Errors: ${errors} listings`);
  console.log("=".repeat(60));
}

fixCategoriesToNames()
  .then(() => {
    console.log("\n✅ Category conversion complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
