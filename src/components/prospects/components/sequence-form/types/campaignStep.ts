import { z } from "zod";

export const campaignStepSchema = z.object({
  step_type: z.enum(["email", "email_2", "linkedin_connection", "linkedin_message"]),
  delay_days: z.coerce.number().min(0),
  message_template_or_prompt: z.string().optional(),
  is_ai_enabled: z.boolean().optional(),
  message_prompt: z.string().optional(),
});

export type CampaignStep = {
  id: string;
  step_type: "email" | "email_2" | "linkedin_connection" | "linkedin_message";
  delay_days: number;
  message_template_or_prompt: string | null;
  sequence_order: number;
  is_ai_enabled?: boolean;
  message_prompt?: string;
};