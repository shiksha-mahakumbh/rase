import { z } from "zod";
import { emailSchema, honeypotFieldSchema } from "@/lib/schemas/commonSchemas";

export const feedbackSubmitSchema = z.object({
  captchaToken: z.string().min(1, "Security verification is required"),
  fullName: z.string().trim().min(2, "Name is required").max(120),
  email: emailSchema,
  rating: z.number().int().min(1).max(5).optional(),
  category: z.string().trim().min(1, "Event or category is required").max(120),
  message: z.string().trim().min(10, "Feedback is too short").max(5000),
  website: honeypotFieldSchema,
});

export type FeedbackSubmitInput = z.infer<typeof feedbackSubmitSchema>;
