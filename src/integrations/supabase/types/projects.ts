export type ProjectStatus = 'active' | 'completed' | 'on_hold';

export interface Project {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  client_name: string;
  description: string | null;
  status: ProjectStatus | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  last_activity_date: string;
}

export interface ProjectCredential {
  id: string;
  created_at: string;
  project_id: string;
  user_id: string;
  service_name: string;
  username: string;
  password: string;
}

export interface ProjectDocument {
  id: string;
  created_at: string;
  project_id: string;
  user_id: string;
  title: string;
  file_path: string;
  file_type: string;
}