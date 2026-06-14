import nodemailer from "nodemailer";
import type { EmailLogStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { EVENT_NAME } from "@/types/registration";

export type EmailTemplate =
  | "registration_confirmation"
  | "payment_confirmation"
  | "admin_alert"
  | "contact_acknowledgement"
  | "feedback_acknowledgement";

type QueueItem = {
  toEmail: string;
  subject: string;
  html: string;
  template: EmailTemplate;
  /** Public ID e.g. SMK2026-000001 — for logs only */
  publicRegistrationId?: string;
  /** registrations.id UUID — required for email_logs FK */
  registrationUuid?: string | null;
};

const MAX_ATTEMPTS = 3;

function emailProviderLabel(host: string): string {
  if (host.includes("brevo") || host.includes("sendinblue")) return "brevo";
  if (host.includes("gmail")) return "gmail";
  return "smtp";
}

function getSmtpConfig() {
  const brevoHost = process.env.BREVO_SMTP_HOST?.trim();
  const brevoUser = process.env.BREVO_SMTP_USER?.trim();
  const brevoPass = process.env.BREVO_SMTP_PASS?.trim();
  const brevoConfigured = Boolean(brevoHost && brevoUser && brevoPass);

  if (brevoConfigured) {
    return {
      host: brevoHost,
      user: brevoUser,
      pass: brevoPass,
      port: Number(process.env.BREVO_SMTP_PORT ?? 587),
      from:
        process.env.BREVO_SMTP_FROM?.trim() ??
        process.env.SMTP_FROM?.trim() ??
        "noreply@shikshamahakumbh.com",
    };
  }

  return {
    host: process.env.SMTP_HOST?.trim(),
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS?.trim() ?? process.env.SMTP_PASSWORD?.trim(),
    port: Number(process.env.SMTP_PORT ?? 587),
    from: process.env.SMTP_FROM?.trim() ?? "noreply@shikshamahakumbh.com",
  };
}

function debugEmail(event: string, payload: Record<string, unknown>) {
  console.info("[email.service]", event, payload);
}

function getTransporter() {
  const { host, user, pass, port } = getSmtpConfig();
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function buildHtml(template: EmailTemplate, data: Record<string, string>) {
  switch (template) {
    case "registration_confirmation":
      return `<p>Dear ${data.fullName},</p><p>Your registration for ${EVENT_NAME} is confirmed.</p><p>Registration ID: <strong>${data.registrationId}</strong></p>`;
    case "payment_confirmation":
      return `<p>Dear ${data.fullName},</p><p>Payment received for registration <strong>${data.registrationId}</strong>.</p>`;
    case "admin_alert":
      return `<p>Admin alert: ${data.message}</p>`;
    case "contact_acknowledgement":
      return `<p>Dear ${data.fullName},</p><p>We received your message and will respond shortly.</p>`;
    case "feedback_acknowledgement":
      return `<p>Thank you for your feedback on ${EVENT_NAME}.</p>`;
    default:
      return data.message ?? "";
  }
}

function mapDeliveryStatus(status: EmailLogStatus): "sent" | "failed" | "pending" | "skipped" {
  if (status === "sent") return "sent";
  if (status === "failed" || status === "skipped") return "failed";
  return "pending";
}

function smtpErrorDetails(error: unknown) {
  const err = error as Error & { code?: string; response?: string; responseCode?: number };
  return {
    message: err instanceof Error ? err.message : String(error),
    code: err.code ?? null,
    response: err.response ?? null,
    responseCode: err.responseCode ?? null,
  };
}

async function deliverEmailLog(logId: string, item: QueueItem) {
  const { host, port, from } = getSmtpConfig();
  const transporter = getTransporter();
  const provider = emailProviderLabel(host ?? "");

  debugEmail("deliver_start", {
    emailLogId: logId,
    registrationId: item.publicRegistrationId ?? null,
    registrationUuid: item.registrationUuid ?? null,
    recipient: item.toEmail,
    template: item.template,
  });

  console.info("EMAIL_SEND_START", {
    registrationId: item.publicRegistrationId ?? null,
    registrationUuid: item.registrationUuid ?? null,
    recipient: item.toEmail,
    provider,
    smtpHost: host ?? null,
    smtpPort: port,
    emailLogId: logId,
  });

  if (!transporter) {
    const smtpError = "SMTP not configured (check SMTP_* or BREVO_SMTP_* env)";
    await prisma.emailLog.update({
      where: { id: logId },
      data: {
        status: "skipped",
        errorMessage: smtpError,
      },
    });
    console.error("EMAIL_SEND_FAILED", {
      registrationId: item.publicRegistrationId ?? null,
      registrationUuid: item.registrationUuid ?? null,
      recipient: item.toEmail,
      provider,
      emailLogId: logId,
      error: { message: smtpError, code: "SMTP_NOT_CONFIGURED", response: null },
    });
    return;
  }

  let lastError = "send failed";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await prisma.emailLog.update({
        where: { id: logId },
        data: { status: "sending", retryCount: attempt - 1 },
      });

      const info = await transporter.sendMail({
        from,
        to: item.toEmail,
        subject: item.subject,
        html: item.html,
      });

      await prisma.emailLog.update({
        where: { id: logId },
        data: {
          status: "sent",
          sentAt: new Date(),
          providerMsgId: info.messageId ?? null,
          errorMessage: null,
          retryCount: attempt - 1,
        },
      });

      debugEmail("smtp_sent", {
        emailLogId: logId,
        registrationId: item.publicRegistrationId ?? null,
        recipient: item.toEmail,
        attempt,
        messageId: info.messageId ?? null,
        smtpResponse: info.response ?? null,
      });

      console.info("EMAIL_SEND_SUCCESS", {
        registrationId: item.publicRegistrationId ?? null,
        registrationUuid: item.registrationUuid ?? null,
        recipient: item.toEmail,
        provider,
        messageId: info.messageId ?? null,
        accepted: info.accepted ?? [],
        rejected: info.rejected ?? [],
        smtpResponse: info.response ?? null,
        emailLogId: logId,
      });

      await writeAuditLog({
        action: "email_sent",
        registrationId: item.registrationUuid ?? null,
        payload: {
          to: item.toEmail,
          template: item.template,
          publicRegistrationId: item.publicRegistrationId,
        },
      });

      transporter.close();
      return;
    } catch (error) {
      const details = smtpErrorDetails(error);
      lastError = details.message;
      debugEmail("smtp_rejected", {
        emailLogId: logId,
        registrationId: item.publicRegistrationId ?? null,
        recipient: item.toEmail,
        attempt,
        reason: lastError,
        code: details.code,
        response: details.response,
      });

      console.error("EMAIL_SEND_FAILED", {
        registrationId: item.publicRegistrationId ?? null,
        registrationUuid: item.registrationUuid ?? null,
        recipient: item.toEmail,
        provider,
        attempt,
        emailLogId: logId,
        error: {
          message: details.message,
          code: details.code,
          response: details.response,
        },
      });

      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, attempt * 1000));
      }
    }
  }

  await prisma.emailLog.update({
    where: { id: logId },
    data: {
      status: "failed",
      retryCount: MAX_ATTEMPTS,
      errorMessage: lastError,
    },
  });

  await writeAuditLog({
    action: "email_failed",
    registrationId: item.registrationUuid ?? null,
    payload: {
      to: item.toEmail,
      error: lastError,
      publicRegistrationId: item.publicRegistrationId,
    },
  });

  transporter.close();
}

/** Create email_logs row first, then attempt SMTP delivery (serverless-safe). */
export async function queueEmail(item: QueueItem) {
  const { host } = getSmtpConfig();

  const log = await prisma.emailLog.create({
    data: {
      registrationId: item.registrationUuid ?? null,
      toEmail: item.toEmail,
      subject: item.subject,
      template: item.template,
      status: "queued",
      provider: emailProviderLabel(host ?? ""),
    },
  });

  console.info("EMAIL_QUEUE_CREATED", {
    emailLogId: log.id,
    registrationId: item.publicRegistrationId ?? null,
    registrationUuid: item.registrationUuid ?? null,
    recipient: item.toEmail,
    provider: emailProviderLabel(host ?? ""),
    status: "queued",
  });

  await deliverEmailLog(log.id, item);

  return prisma.emailLog.findUniqueOrThrow({ where: { id: log.id } });
}

export { mapDeliveryStatus };

export async function sendRegistrationConfirmation(options: {
  registrationId: string;
  registrationUuid?: string | null;
  fullName: string;
  email: string;
}) {
  return queueEmail({
    toEmail: options.email,
    subject: `${EVENT_NAME} — Registration Confirmed`,
    html: buildHtml("registration_confirmation", {
      fullName: options.fullName,
      registrationId: options.registrationId,
    }),
    template: "registration_confirmation",
    publicRegistrationId: options.registrationId,
    registrationUuid: options.registrationUuid ?? null,
  });
}

export async function sendPaymentConfirmation(options: {
  registrationId: string;
  registrationUuid?: string | null;
  fullName: string;
  email: string;
}) {
  return queueEmail({
    toEmail: options.email,
    subject: `${EVENT_NAME} — Payment Confirmed`,
    html: buildHtml("payment_confirmation", {
      fullName: options.fullName,
      registrationId: options.registrationId,
    }),
    template: "payment_confirmation",
    publicRegistrationId: options.registrationId,
    registrationUuid: options.registrationUuid ?? null,
  });
}

export async function sendContactAcknowledgement(options: {
  fullName: string;
  email: string;
}) {
  return queueEmail({
    toEmail: options.email,
    subject: `${EVENT_NAME} — Message Received`,
    html: buildHtml("contact_acknowledgement", { fullName: options.fullName }),
    template: "contact_acknowledgement",
  });
}

export async function sendFeedbackAcknowledgement(options: { email: string }) {
  return queueEmail({
    toEmail: options.email,
    subject: `${EVENT_NAME} — Thank You for Your Feedback`,
    html: buildHtml("feedback_acknowledgement", {}),
    template: "feedback_acknowledgement",
  });
}

export async function sendAdminAlert(options: { message: string; toEmail?: string }) {
  const adminEmail = options.toEmail ?? process.env.SMTP_FROM ?? process.env.BREVO_SMTP_FROM;
  if (!adminEmail) return null;
  return queueEmail({
    toEmail: adminEmail,
    subject: `${EVENT_NAME} — Admin Alert`,
    html: buildHtml("admin_alert", { message: options.message }),
    template: "admin_alert",
  });
}
