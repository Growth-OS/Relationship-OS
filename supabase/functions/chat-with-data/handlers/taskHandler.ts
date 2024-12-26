import { SupabaseClient } from '@supabase/supabase-js';

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