import { supabase } from "@/lib/supabase";

export async function getCategoryIconsMap(): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from("category_icons")
      .select("category_name, filename");
    if (error) throw error;
    const map: Record<string, string> = {};
    for (const row of data || []) {
      map[row.category_name] = row.filename;
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
