import { z } from "zod";

export const sequenceFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(["active", "paused", "completed"]),
  steps: z.array(z.object({
    step_number: z.number(),
    step_type: z.enum(["email", "linkedin_connection", "linkedin_message"]),
    message_template: z.string().optional(),
    delay_days: z.number().min(0),
  })).min(1, "At least one step is required"),
});

export type SequenceFormValues = z.infer<typeof sequenceFormSchema>;