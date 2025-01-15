import { z } from "zod";

export const stepSchema = z.object({
  step_type: z.string(),
  delay_days: z.number().min(0),
  message_template_or_prompt: z.string().optional(),
  is_ai_enabled: z.boolean().optional(),
  message_prompt: z.string().optional(),
});

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  steps: z.array(stepSchema).min(1, "At least one step is required"),
});

export type FormValues = z.infer<typeof formSchema>;