import { z } from "zod";
import { DONATION_MIN_AMOUNT } from "@/data/donation-hub";
import { isValidPan } from "@/lib/registration/validation";

export const donationFormSchema = z.object({
  donationKind: z.enum(["donation", "sponsorship"]),
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Valid email is required"),
  phone: z
    .string()
    .trim()
    .min(10, "Valid mobile number is required")
    .max(15)
    .regex(/^[+]?[\d\s-]+$/, "Valid mobile number is required"),
  panNumber: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .refine(isValidPan, "Valid PAN is mandatory for 80G receipt"),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  amount: z.number().min(DONATION_MIN_AMOUNT, `Minimum donation is ₹${DONATION_MIN_AMOUNT}`),
  tierId: z.string().optional(),
  razorpayPaymentId: z.string().min(1, "Complete Razorpay payment first"),
  razorpayOrderId: z.string().min(1, "Complete Razorpay payment first"),
}).superRefine((data, ctx) => {
  if (data.donationKind === "sponsorship" && !data.organization?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Organization is required for sponsorship",
      path: ["organization"],
    });
  }
});

export type DonationFormValues = z.infer<typeof donationFormSchema>;

export function normalizePan(value: string): string {
  return value.trim().toUpperCase();
}
