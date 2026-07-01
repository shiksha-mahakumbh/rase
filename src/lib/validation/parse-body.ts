import type { ZodType } from "zod";
import { ServiceError } from "@/server/lib/errors";

export function parseBody<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request";
    throw new ServiceError(message, 400, "VALIDATION");
  }
  return result.data;
}
