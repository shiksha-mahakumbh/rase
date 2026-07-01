import { z } from "zod";

export const emailSchema = z.string().trim().email("Valid email is required");

export const optionalPhoneSchema = z
  .string()
  .trim()
  .max(15)
  .regex(/^[+]?[\d\s-]+$/, "Valid phone number is required")
  .optional()
  .or(z.literal(""));

export const honeypotFieldSchema = z.string().max(0).optional().or(z.literal(""));
