export type TaskSource = 'projects' | 'deals' | 'sequences' | 'substack' | 'ideas' | 'content' | 'other';

export interface TaskListProps {
  sourceId?: string;
  sourceType?: TaskSource;
  source?: string; // For backwards compatibility
  showArchived?: boolean;
  showPagination?: boolean;
  groupBySource?: boolean;
}

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
  source?: TaskSource;
  source_id?: string;
  priority?: string;
  projects?: { id: string; name: string } | null;
  deals?: { id: string; company_name: string } | null;
  sequences?: { id: string; name: string } | null;
  substack_posts?: { id: string; title: string } | null;
}

export interface TasksResponse {
  tasks: TaskData[];
  total: number;
}