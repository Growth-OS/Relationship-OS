import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

export async function handleProspectData(
  supabase: SupabaseClient,
  userId: string,
  contextData: any
) {
  const { data: prospects } = await supabase
    .from('prospects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  contextData.prospects = {
    prospects: prospects || [],
    summary: {
      totalProspects: prospects?.length || 0,
      activeProspects: prospects?.filter(p => p.status === 'active').length || 0,
      convertedProspects: prospects?.filter(p => p.status === 'converted').length || 0,
      bySource: prospects?.reduce((acc: Record<string, number>, p) => {
        acc[p.source] = (acc[p.source] || 0) + 1;
        return acc;
      }, {})
    }
  };
}