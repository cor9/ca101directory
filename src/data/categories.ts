import { supabase } from "@/lib/supabase";

export async function getCategoryIconsMap(): Promise<Record<string, string>> {
  try {
    // Primary: dedicated mapping table
    const primary = await supabase
      .from("category_icons")
      .select("category_name, filename");

    const map: Record<string, string> = {};

    if (!primary.error && Array.isArray(primary.data) && primary.data.length) {
      for (const row of primary.data) {
        if (row?.category_name && row?.filename) {
          map[row.category_name] = row.filename;
        }
      }
      return map;
    }

    // Fallback: infer from categories table (supports icon or category_icon columns)
    const fallback = await supabase
      .from("categories")
      .select('category_name, icon, category_icon, "Category Name"');

    if (!fallback.error && Array.isArray(fallback.data)) {
      for (const row of fallback.data) {
        const name = row?.category_name || row?.["Category Name"]; // support Airtable import
        const filename = row?.icon || row?.category_icon;
        if (name && filename) {
          map[name] = filename;
        }
      }
    }

    return map;
  } catch (e) {
    console.error("getCategoryIconsMap error", e);
    return {};
  }
}

export async function getCategories() {
  console.log("getCategories: Starting fetch from categories table");

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("category_name", { ascending: true });

    console.log("getCategories: Result:", { data, error });

    if (error) {
      console.error("getCategories: Error:", error);
      throw error;
    }

    // Transform the data to match expected format
    const transformedData =
      data?.map((category) => ({
        id: category.id,
        category_name: category["Category Name"] || category.category_name,
        description: category.description || null,
        icon: category.icon || null,
        created_at: category["Created Time"] || category.created_at || null,
        updated_at: category.updated_at || null,
      })) || [];

    console.log(
      "getCategories: Returning",
      transformedData.length,
      "categories",
    );
    return transformedData;
  } catch (error) {
    console.error("getCategories: Error fetching categories:", error);
    // Return empty array as fallback
    return [];
  }
}
