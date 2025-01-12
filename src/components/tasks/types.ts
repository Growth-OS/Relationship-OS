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
  deal_id: string | null;
  substack_post_id: string | null;
}

export interface TaskData extends Task {
  projects?: { id: string; name: string } | null;
  deals?: { id: string; company_name: string } | null;
  substack_posts?: { id: string; title: string } | null;
}

export interface TasksResponse {
  data: TaskData[];
  count: number;
}