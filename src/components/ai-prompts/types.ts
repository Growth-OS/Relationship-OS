export interface AIPrompt {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  system_prompt: string;
  category: string;
  is_active: boolean | null;
}