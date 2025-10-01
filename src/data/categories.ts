import { supabase } from '@/lib/supabase';

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories_public')
    .select('*')
    .order('category_name', { ascending: true });
  if (error) throw error;
  return data;
}
