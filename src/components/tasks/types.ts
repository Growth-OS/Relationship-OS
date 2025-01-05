import { TaskSource } from "@/integrations/supabase/types/tasks";

export interface TaskListProps {
  source?: TaskSource;
  projectId?: string;
  showArchived?: boolean;
}

export interface TaskData {
  completed: boolean;
  created_at: string;
  deal_id: string;
  description: string;
  due_date: string;
  id: string;
  priority: string;
  project_id: string;
  sequence_id: string;
  source: TaskSource;
  title: string;
  user_id: string;
  projects?: { id: string; name: string };
  deals?: { id: string; company_name: string };
  substack_posts?: { id: string; title: string };
  sequences?: { id: string; name: string };
}

export interface TasksResponse {
  tasks: TaskData[];
  totalCount: number;
}