import { SupabaseClient } from '@supabase/supabase-js';

export async function handleAffiliateData(
  supabase: SupabaseClient,
  userId: string,
  contextData: any
) {
  const { data: partners } = await supabase
    .from('affiliate_partners')
    .select('*')
    .eq('user_id', userId);
  
  const { data: earnings } = await supabase
    .from('affiliate_earnings')
    .select(`
      *,
      affiliate_partners (
        name,
        program
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  contextData.affiliates = {
    partners: partners || [],
    earnings: earnings || [],
    summary: {
      totalPartners: partners?.length || 0,
      totalEarnings: earnings?.reduce((sum, earning) => sum + Number(earning.amount), 0) || 0,
      recentEarnings: earnings?.slice(0, 5) || []
    }
  };
}