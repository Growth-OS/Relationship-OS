export interface LinkedInProfile {
  id: string;
  created_at: string;
  user_id: string;
  profile_url: string;
  name: string;
  job_title: string | null;
  profile_image_url: string | null;
  is_active: boolean | null;
}

export interface SubstackPost {
  id: string;
  created_at: string;
  title: string;
  publish_date: string;
  user_id: string;
  status: string;
  content: string | null;
}

export interface AIPrompt {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  system_prompt: string;
  category: string | null;
  is_active: boolean | null;
}