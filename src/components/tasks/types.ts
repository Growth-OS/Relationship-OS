export type TaskSource = 'content' | 'other' | 'deals' | 'projects' | 'ideas' | 'substack' | 'outreach';

export interface TaskData {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
  source?: TaskSource;
  source_id?: string;
  priority?: string;
  project_id?: string;
  deal_id?: string;
  substack_post_id?: string;
  ai_generated_message?: string;
  generation_prompt?: string;
  last_generation_date?: string;
  is_recurring?: boolean;
  recurrence_interval?: string;
  last_completed_date?: string;
  next_occurrence_date?: string;
}

export interface TaskFormValues {
  title: string;
  description?: string;
  due_date: string;
  priority: string;
  source?: TaskSource;
  source_id?: string;
  is_recurring?: boolean;
  recurrence_interval?: string;
}

export interface TaskListProps {
  sourceType?: TaskSource;
  sourceId?: string;
  showPagination?: boolean;
  groupBySource?: boolean;
  showArchived?: boolean;
}