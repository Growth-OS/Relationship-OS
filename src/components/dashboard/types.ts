export interface DailyBriefing {
  pendingTasks: {
    total: number;
    items: Array<{
      title: string;
      due_date: string | null;
    }>;
  };
  recentEmails?: {
    total: number;
    unread: number;
    items: Array<{
      subject: string;
      from: string;
      received_at: string;
    }>;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface EmailMessage {
  id: string;
  subject: string | null;
  from_email: string;
  from_name: string | null;
  received_at: string;
  is_read: boolean;
  is_starred?: boolean;
  snippet: string | null;
  folder?: string;
}