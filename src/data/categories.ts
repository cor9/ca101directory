import { supabase } from "@/lib/supabase";

export async function getCategories() {
  console.log("getCategories: Starting fetch from categories table");

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("Category Name", { ascending: true });

  console.log("getCategories: Result:", { data, error });

  if (error) {
    console.error("getCategories: Error:", error);
    throw error;
  }

  // Transform the data to match expected format
  const transformedData =
    data?.map((category) => ({
      id: category.id,
      category_name: category["Category Name"],
      description: category.description || null,
      icon: category.icon || null,
      created_at: category["Created Time"] || null,
      updated_at: category["Created Time"] || null,
    })) || [];

  console.log("getCategories: Returning", transformedData.length, "categories");
  return transformedData;
}
