"use client";

import { createClient } from "@/lib/supabase/client";

export async function getCategoriesClient() {
  console.log("getCategoriesClient: Starting fetch from categories table");

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("category_name", { ascending: true });

    console.log("getCategoriesClient: Result:", { data, error });

    if (error) {
      console.error("getCategoriesClient: Error:", error);
      throw error;
    }

    // Transform the data to match expected format
    const transformedData =
      data?.map((category) => ({
        id: category.id,
        category_name: category.category_name,
        description: category.description || null,
        icon: category.icon || null,
        created_at: category.created_at || null,
        updated_at: category.updated_at || null,
      })) || [];

    console.log("getCategoriesClient: Returning", transformedData.length, "categories");
    return transformedData;
  } catch (error) {
    console.error("getCategoriesClient: Error fetching categories:", error);
    // Return empty array as fallback
    return [];
  }
}
