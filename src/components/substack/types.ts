import { Json } from "@/integrations/supabase/types";

export type SubstackPostStatus = "idea" | "writing" | "passed_to_fausta" | "schedule" | "live";

export interface SubstackPostFormData {
  title: string;
  content: string;
  status: SubstackPostStatus;
  publish_date: string;
  user_id: string;
}