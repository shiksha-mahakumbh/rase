import { ServiceError } from "@/server/lib/errors";

/** Reject bot submissions that fill hidden honeypot fields. */
export function assertHoneypotEmpty(value?: string | null): void {
  if (value?.trim()) {
    throw new ServiceError("Invalid submission", 400, "SPAM");
  }
}
