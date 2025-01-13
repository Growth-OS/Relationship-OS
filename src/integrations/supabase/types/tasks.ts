export type TaskSource = 'deals' | 'content' | 'ideas' | 'substack' | 'projects' | 'other';

export interface Task {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean | null;
  source: TaskSource | null;
  source_id: string | null;
  priority: string | null;
  project_id: string | null;
}