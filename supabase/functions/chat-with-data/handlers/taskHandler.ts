import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

export async function handleTaskData(
  supabase: SupabaseClient,
  userId: string,
  contextData: any
) {
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', false)
    .order('due_date', { ascending: true });
  
  contextData.tasks = tasks;
}