import { z } from "zod";

export const campaignStepSchema = z.object({
  step_type: z.enum(["email", "email_2", "linkedin_connection", "linkedin_message"]),
  delay_days: z.coerce.number().min(0),
  message_template_or_prompt: z.string().optional(),
  is_ai_enabled: z.boolean().optional(),
  message_prompt: z.string().optional(),
});

export type CampaignStep = z.infer<typeof campaignStepSchema>;