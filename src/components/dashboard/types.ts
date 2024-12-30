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
  role: 'user' | 'assistant';
  content: string;
}