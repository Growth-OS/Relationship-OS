import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  steps: z.array(z.object({
    step_type: z.enum(["email", "linkedin_connection", "linkedin_message"]),
    delay_days: z.coerce.number().min(0),
    message_template: z.string().optional(),
  })).min(1, "At least one step is required"),
});

export type FormValues = z.infer<typeof formSchema>;