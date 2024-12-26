import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

export async function handleSubstackData(
  supabase: SupabaseClient,
  userId: string,
  contextData: any
) {
  const { data: posts } = await supabase
    .from('substack_posts')
    .select('*')
    .eq('user_id', userId)
    .order('publish_date', { ascending: false });

  contextData.substack = {
    posts: posts || [],
    summary: {
      totalPosts: posts?.length || 0,
      draftPosts: posts?.filter(p => p.status === 'draft').length || 0,
      publishedPosts: posts?.filter(p => p.status === 'published').length || 0,
      scheduledPosts: posts?.filter(p => p.status === 'scheduled').length || 0,
    }
  };
}