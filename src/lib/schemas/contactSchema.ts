import { z } from "zod";
import { emailSchema, honeypotFieldSchema, optionalPhoneSchema } from "@/lib/schemas/commonSchemas";

export const contactSubmitSchema = z.object({
  captchaToken: z.string().min(1, "Security verification is required"),
  fullName: z.string().trim().min(2, "Name is required").max(120),
  email: emailSchema,
  phone: optionalPhoneSchema,
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message is too short").max(5000),
  website: honeypotFieldSchema,
});

export type ContactSubmitInput = z.infer<typeof contactSubmitSchema>;
