import { supabase } from '@/lib/supabase';

export async function getCategories() {
  console.log("getCategories: Starting fetch from categories_public table");
  
  const { data, error } = await supabase
    .from('categories_public')
    .select('*')
    .order('category_name', { ascending: true });
    
  console.log("getCategories: Result:", { data, error });
  
  if (error) {
    console.error("getCategories: Error:", error);
    throw error;
  }
  
  console.log("getCategories: Returning", data?.length || 0, "categories");
  return data;
}
