export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface DailyBriefing {
  unreadEmails: number;
  pendingTasks: {
    total: number;
    items: Array<{
      title: string;
      due_date?: string;
    }>;
  };
}