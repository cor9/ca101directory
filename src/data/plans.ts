import { supabase } from '@/lib/supabase';

export async function getPlans() {
  const { data, error } = await supabase
    .from('plans_public')
    .select('*')
    .order('plan', { ascending: true });
  if (error) throw error;
  return data;
}
