import { z } from "zod";
import { emailSchema, honeypotFieldSchema } from "@/lib/schemas/commonSchemas";

export const newsletterSubscribeSchema = z.object({
  email: emailSchema,
  fullName: z.string().trim().max(120).optional().or(z.literal("")),
  marketingConsent: z
    .boolean()
    .refine((value) => value === true, { message: "Marketing consent is required" }),
  captchaToken: z.string().min(1, "Security verification is required"),
  website: honeypotFieldSchema,
});

export const newsletterUnsubscribeSchema = z
  .object({
    email: emailSchema,
    token: z.string().min(1).optional(),
    captchaToken: z.string().min(1).optional(),
    website: honeypotFieldSchema,
  })
  .superRefine((data, ctx) => {
    if (!data.token && !data.captchaToken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Security verification or unsubscribe link is required",
        path: ["captchaToken"],
      });
    }
  });

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
export type NewsletterUnsubscribeInput = z.infer<typeof newsletterUnsubscribeSchema>;
