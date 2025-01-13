export type TaskSource = 'content' | 'other' | 'deals' | 'projects' | 'ideas' | 'substack';

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  source: TaskSource;
  source_id?: string;
  priority?: string;
  project_id?: string;
  deal_id?: string;
  substack_post_id?: string;
  created_at: string;
  user_id: string;
}