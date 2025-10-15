"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCategoriesByIds(categoryIds: string[]) {
  try {
    const supabase = createClient();
    
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, category_name')
      .in('id', categoryIds);
    
    if (error) {
      console.error('Error fetching categories:', error);
      return {};
    }
    
    if (!categories) {
      return {};
    }
    
    // Convert array to object for easy lookup
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.category_name;
      return acc;
    }, {} as Record<string, string>);
    
  } catch (error) {
    console.error('Error in getCategoriesByIds:', error);
    return {};
  }
}
