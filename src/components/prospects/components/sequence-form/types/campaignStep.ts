import { z } from "zod";

export const campaignStepSchema = z.object({
  step_type: z.enum(["email", "email_2", "linkedin_connection", "linkedin_message"]),
  delay_days: z.coerce.number().min(0),
});

export type CampaignStep = {
  id: string;
  step_type: "email" | "email_2" | "linkedin_connection" | "linkedin_message";
  delay_days: number;
  sequence_order: number;
};