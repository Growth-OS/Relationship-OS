import { z } from "zod";
import { campaignStepSchema } from "./campaignStep";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  steps: z.array(campaignStepSchema).min(1, "At least one step is required"),
});

export type FormValues = z.infer<typeof formSchema>;
export type { CampaignStep } from "./campaignStep";