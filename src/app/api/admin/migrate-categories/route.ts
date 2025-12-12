import { getCategories } from "@/data/categories";
import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * One-time migration endpoint to convert UUID categories to category names
 * GET /api/admin/migrate-categories
 */
export async function GET() {
  try {
    console.log("=== STARTING CATEGORY MIGRATION ===");

    // Get all categories to build UUID -> name map
    const categories = await getCategories();
    const categoryMap = new Map(
      categories.map((cat) => [cat.id, cat.category_name]),
    );

    console.log(
      `Loaded ${categories.length} categories:`,
      Array.from(categoryMap.entries()).map(([id, name]) => `${id} -> ${name}`),
    );

    const supabase = createServerClient();

    // Get all listings
    const { data: listings, error: fetchError } = await supabase
      .from("listings")
      .select("id, listing_name, categories")
      .not("categories", "is", null);

    if (fetchError) {
      console.error("Error fetching listings:", fetchError);
      return NextResponse.json(
        {
          success: false,
          error: fetchError.message,
        },
        { status: 500 },
      );
    }

    console.log(`Found ${listings?.length || 0} listings with categories`);

    const updates: Array<{
      id: string;
      listing_name: string;
      oldCategories: any;
      newCategories: string[];
    }> = [];

    for (const listing of listings || []) {
      let categoriesArray: string[] = [];

      // Parse categories - could be string or array
      if (typeof listing.categories === "string") {
        categoriesArray = listing.categories
          .split(", ")
          .map((c) => c.trim())
          .filter(Boolean);
      } else if (Array.isArray(listing.categories)) {
        categoriesArray = listing.categories;
      }

      // Check if any categories are UUIDs (36 chars with dashes)
      const hasUUIDs = categoriesArray.some(
        (cat) =>
          typeof cat === "string" && cat.length === 36 && cat.includes("-"),
      );

      if (hasUUIDs) {
        // Convert UUIDs to names
        const newCategories = categoriesArray
          .map((catId) => {
            // If it's a UUID, look up the name
            if (catId.length === 36 && catId.includes("-")) {
              const name = categoryMap.get(catId);
              console.log(
                `Converting UUID ${catId} to name: ${name || "NOT FOUND"}`,
              );
              return name || catId; // Keep UUID if name not found
            }
            // Already a name, keep it
            return catId;
          })
          .filter(Boolean);

        updates.push({
          id: listing.id,
          listing_name: listing.listing_name || "Unknown",
          oldCategories: categoriesArray,
          newCategories,
        });

        // Update the database
        const { error: updateError } = await supabase
          .from("listings")
          .update({ categories: newCategories })
          .eq("id", listing.id);

        if (updateError) {
          console.error(`Error updating listing ${listing.id}:`, updateError);
        } else {
          console.log(
            `✅ Updated ${listing.listing_name}: ${categoriesArray.join(", ")} -> ${newCategories.join(", ")}`,
          );
        }
      }
    }

    console.log("=== MIGRATION COMPLETE ===");
    console.log(`Updated ${updates.length} listings`);

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${updates.length} listings`,
      updates,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
