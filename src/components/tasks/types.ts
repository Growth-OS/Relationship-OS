export type TaskSource = 'projects' | 'deals' | 'sequences' | 'substack' | 'ideas' | 'content' | 'other';

export interface TaskListProps {
  sourceId?: string;
  sourceType?: TaskSource;
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
  projects?: { id: string; name: string };
  deals?: { id: string; company_name: string };
  sequences?: { id: string; name: string };
  substack_posts?: { id: string; title: string };
}

export interface TasksResponse {
  tasks: TaskData[];
  totalCount: number;
}