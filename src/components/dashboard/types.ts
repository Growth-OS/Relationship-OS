export interface DailyBriefing {
  pendingTasks: {
    total: number;
    items: Array<{
      title: string;
      due_date: string | null;
    }>;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  project_id: string | null;
  created_at: string;
  message: string;
}