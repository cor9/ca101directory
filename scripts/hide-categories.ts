#!/usr/bin/env tsx
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const CATEGORIES_TO_HIDE = [
  "Stunt Training",
  "Modeling/Print Agents",
  "Modeling Portfolios",
  "Lifestyle Photographers",
  "Financial Advisors",
  "Event Calendars",
  "Entertainment Lawyers",
  "Dance Classes",
  "Cosmetic Dentistry",
  "Content Creators",
  "Comedy Coaches",
];

async function hideCategories() {
  console.log(`📋 Hiding ${CATEGORIES_TO_HIDE.length} categories...\n`);

  // Fetch all categories
  const { data: allCategories, error } = await supabase
    .from("categories")
    .select("id, category_name, hidden");

  if (error) {
    console.error("❌ Error fetching categories:", error);
    return;
  }

  console.log(`🔍 Found ${allCategories?.length || 0} total categories\n`);

  let successCount = 0;
  let notFoundCount = 0;
  let alreadyHiddenCount = 0;

  for (const categoryName of CATEGORIES_TO_HIDE) {
    const category = allCategories?.find(
      (cat) => cat.category_name === categoryName,
    );

    if (!category) {
      console.log(`⚠️  Not found: "${categoryName}"`);
      notFoundCount++;
      continue;
    }

    if (category.hidden) {
      console.log(`ℹ️  Already hidden: "${categoryName}"`);
      alreadyHiddenCount++;
      continue;
    }

    // Update to hidden = true
    const { error: updateError } = await supabase
      .from("categories")
      .update({ hidden: true })
      .eq("id", category.id);

    if (updateError) {
      console.log(
        `❌ Failed to hide "${categoryName}": ${updateError.message}`,
      );
      if (
        updateError.message.includes("column") &&
        updateError.message.includes("hidden")
      ) {
        console.log("\n⚠️  ERROR: The 'hidden' column doesn't exist!");
        console.log(
          "Please follow the instructions in INSTRUCTIONS_HIDE_CATEGORIES.md\n",
        );
        return;
      }
    } else {
      console.log(`✅ Hidden: "${categoryName}"`);
      successCount++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Successfully hidden: ${successCount}`);
  if (alreadyHiddenCount > 0) {
    console.log(`ℹ️  Already hidden: ${alreadyHiddenCount}`);
  }
  if (notFoundCount > 0) {
    console.log(`⚠️  Not found: ${notFoundCount}`);
  }
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  console.log("🎉 Categories have been hidden successfully!");
  console.log(
    "They will no longer appear in dropdowns or category listings.\n",
  );
}

hideCategories();
