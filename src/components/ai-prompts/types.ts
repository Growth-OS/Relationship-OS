export interface BasePromptForm {
  title: string;
  system_prompt: string;
  category: string;
  user_id: string;
}

export interface AIPrompt extends BasePromptForm {
  id: string;
  created_at: string;
  is_active: boolean | null;
}