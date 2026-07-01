import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import {
  sendNewsletterConfirmEmail,
  sendNewsletterWelcomeEmail,
} from "@/server/services/email.service";
import {
  createNewsletterConfirmToken,
  createNewsletterUnsubscribeToken,
  newsletterTokensEnabled,
  verifyNewsletterConfirmToken,
  verifyNewsletterUnsubscribeToken,
} from "@/lib/security/newsletter-token";
import { SITE_URL } from "@/config/site";
import { ServiceError } from "@/server/lib/errors";

export async function subscribeNewsletter(input: {
  email: string;
  fullName?: string;
  source?: string;
  subscribedIp?: string | null;
  marketingConsent?: boolean;
}) {
  const email = input.email.trim().toLowerCase();
  if (!input.marketingConsent) {
    throw new ServiceError("Marketing consent is required", 400);
  }

  const existing = await prisma.newsletterSubscription.findUnique({ where: { email } });
  if (existing?.status === "subscribed") {
    return { row: existing, pendingConfirmation: false as const };
  }

  const tokensEnabled = newsletterTokensEnabled();
  const nextStatus = tokensEnabled ? ("pending" as const) : ("subscribed" as const);

  const row = await prisma.newsletterSubscription.upsert({
    where: { email },
    create: {
      email,
      fullName: input.fullName?.trim() ?? null,
      source: input.source ?? "website",
      subscribedIp: input.subscribedIp ?? null,
      status: nextStatus,
    },
    update: {
      fullName: input.fullName?.trim() ?? undefined,
      status: nextStatus,
      unsubscribedAt: null,
    },
  });

  if (tokensEnabled) {
    const confirmToken = createNewsletterConfirmToken(email);
    const confirmUrl = `${SITE_URL}/newsletter/confirm?token=${encodeURIComponent(confirmToken)}`;
    void sendNewsletterConfirmEmail({ email, confirmUrl });
  } else {
    const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
    void sendNewsletterWelcomeEmail({ email, unsubscribeUrl });
  }

  await writeAuditLog({
    action: "system_event",
    entityType: "newsletter_subscriptions",
    entityId: row.id,
    ipAddress: input.subscribedIp ?? null,
    payload: { event: tokensEnabled ? "newsletter_pending" : "newsletter_subscribed", email },
  });

  return { row, pendingConfirmation: tokensEnabled };
}

export async function confirmNewsletterSubscription(token: string) {
  const verified = verifyNewsletterConfirmToken(token);
  if (!verified) {
    throw new ServiceError("Invalid or expired confirmation link", 400, "INVALID_TOKEN");
  }

  const row = await prisma.newsletterSubscription.findUnique({
    where: { email: verified.email },
  });
  if (!row || row.deletedAt) {
    throw new ServiceError("Subscription not found", 404, "NOT_FOUND");
  }
  if (row.status === "subscribed") {
    return row;
  }

  const updated = await prisma.newsletterSubscription.update({
    where: { email: verified.email },
    data: { status: "subscribed", unsubscribedAt: null },
  });

  const unsubToken = createNewsletterUnsubscribeToken(verified.email);
  const unsubscribeUrl = `${SITE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(verified.email)}&token=${encodeURIComponent(unsubToken)}`;
  void sendNewsletterWelcomeEmail({ email: verified.email, unsubscribeUrl });

  await writeAuditLog({
    action: "system_event",
    entityType: "newsletter_subscriptions",
    entityId: updated.id,
    payload: { event: "newsletter_confirmed", email: verified.email },
  });

  return updated;
}

export async function unsubscribeNewsletter(input: {
  email: string;
  token?: string;
  verifiedViaCaptcha?: boolean;
}) {
  const normalized = input.email.trim().toLowerCase();

  if (input.token) {
    if (!verifyNewsletterUnsubscribeToken(input.token, normalized)) {
      throw new ServiceError("Invalid or expired unsubscribe link", 400, "INVALID_TOKEN");
    }
  } else if (!input.verifiedViaCaptcha) {
    if (newsletterTokensEnabled()) {
      throw new ServiceError("Unsubscribe link or verification is required", 400);
    }
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
