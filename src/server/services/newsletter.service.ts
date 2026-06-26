import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";

export async function subscribeNewsletter(input: {
  email: string;
  fullName?: string;
  source?: string;
  subscribedIp?: string | null;
  marketingConsent?: boolean;
}) {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ServiceError("Valid email is required", 400);
  }
  if (!input.marketingConsent) {
    throw new ServiceError("Marketing consent is required", 400);
  }

  const row = await prisma.newsletterSubscription.upsert({
    where: { email },
    create: {
      email,
      fullName: input.fullName?.trim() ?? null,
      source: input.source ?? "website",
      subscribedIp: input.subscribedIp ?? null,
      status: "subscribed",
    },
    update: {
      fullName: input.fullName?.trim() ?? undefined,
      status: "subscribed",
      unsubscribedAt: null,
    },
  });

  await writeAuditLog({
    action: "system_event",
    entityType: "newsletter_subscriptions",
    entityId: row.id,
    ipAddress: input.subscribedIp ?? null,
    payload: { event: "newsletter_subscribed", email },
  });

  return row;
}

export async function unsubscribeNewsletter(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new ServiceError("Valid email is required", 400);
  }

  const existing = await prisma.newsletterSubscription.findUnique({
    where: { email: normalized },
  });
  if (!existing || existing.status === "unsubscribed") {
    return { id: existing?.id ?? null, alreadyUnsubscribed: true as const };
  }

  const row = await prisma.newsletterSubscription.update({
    where: { email: normalized },
    data: { status: "unsubscribed", unsubscribedAt: new Date() },
  });

  await writeAuditLog({
    action: "system_event",
    entityType: "newsletter_subscriptions",
    entityId: row.id,
    payload: { event: "newsletter_unsubscribed", email: normalized },
  });

  return row;
}

export async function listNewsletterSubscriptions(options: { limit?: number; offset?: number }) {
  const { limit = 50, offset = 0 } = options;
  const where = { deletedAt: null, status: "subscribed" as const };
  const [items, total] = await Promise.all([
    prisma.newsletterSubscription.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, skip: offset }),
    prisma.newsletterSubscription.count({ where }),
  ]);
  return { items, total, limit, offset };
}
