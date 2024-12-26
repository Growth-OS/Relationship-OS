import { SupabaseClient } from '@supabase/supabase-js';

export async function handleDealData(
  supabase: SupabaseClient,
  userId: string,
  contextData: any
) {
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .eq('user_id', userId);
  
  contextData.deals = deals;
}