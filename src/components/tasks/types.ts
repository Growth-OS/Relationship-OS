export type TaskSource = 'deals' | 'content' | 'ideas' | 'substack' | 'projects' | 'other' | 'outreach' | 'sequences';

export interface TaskListProps {
  sourceType?: TaskSource;
  sourceId?: string;
  showPagination?: boolean;
  groupBySource?: boolean;
  showArchived?: boolean;
}

export interface TaskData {
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
  projects?: {
    id: string;
    name: string;
  };
  deals?: {
    id: string;
    company_name: string;
  };
  substack_posts?: {
    id: string;
    title: string;
  };
  sequence_id?: string;
}