import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

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