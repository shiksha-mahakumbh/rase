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
  registrationId?: string;
};

const queue: QueueItem[] = [];
let processing = false;

function emailProviderLabel(): string {
  const host = process.env.SMTP_HOST ?? "";
  if (host.includes("brevo") || host.includes("sendinblue")) return "brevo";
  return "smtp";
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
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

export async function queueEmail(item: QueueItem) {
  const log = await prisma.emailLog.create({
    data: {
      registrationId: item.registrationId ?? null,
      toEmail: item.toEmail,
      subject: item.subject,
      template: item.template,
      status: "queued",
      provider: emailProviderLabel(),
    },
  });

  queue.push(item);
  void processQueue();

  return log;
}

async function processQueue() {
  if (processing) return;
  processing = true;

  const transporter = getTransporter();
  const from = process.env.SMTP_FROM ?? "noreply@shikshamahakumbh.com";

  while (queue.length > 0) {
    const item = queue.shift()!;
    const log = await prisma.emailLog.findFirst({
      where: { toEmail: item.toEmail, subject: item.subject, status: "queued" },
      orderBy: { createdAt: "desc" },
    });

    if (!transporter) {
      if (log) {
        await prisma.emailLog.update({
          where: { id: log.id },
          data: { status: "skipped", errorMessage: "SMTP not configured" },
        });
      }
      continue;
    }

    try {
      if (log) await prisma.emailLog.update({ where: { id: log.id }, data: { status: "sending" } });
      const info = await transporter.sendMail({
        from,
        to: item.toEmail,
        subject: item.subject,
        html: item.html,
      });

      if (log) {
        await prisma.emailLog.update({
          where: { id: log.id },
          data: {
            status: "sent",
            sentAt: new Date(),
            providerMsgId: info.messageId ?? null,
          },
        });
      }

      await writeAuditLog({
        action: "email_sent",
        registrationId: item.registrationId ?? null,
        payload: { to: item.toEmail, template: item.template },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "send failed";
      if (log) {
        const retryCount = (log.retryCount ?? 0) + 1;
        await prisma.emailLog.update({
          where: { id: log.id },
          data: {
            status: retryCount < 3 ? "queued" : "failed",
            retryCount,
            errorMessage: message,
          },
        });
        if (retryCount < 3) queue.push(item);
      }
      await writeAuditLog({
        action: "email_failed",
        registrationId: item.registrationId ?? null,
        payload: { to: item.toEmail, error: message },
      });
    }
  }

  processing = false;
}

export async function sendRegistrationConfirmation(options: {
  registrationId: string;
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
    registrationId: options.registrationId,
  });
}

export async function sendPaymentConfirmation(options: {
  registrationId: string;
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
    registrationId: options.registrationId,
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
  const adminEmail = options.toEmail ?? process.env.SMTP_FROM;
  if (!adminEmail) return null;
  return queueEmail({
    toEmail: adminEmail,
    subject: `${EVENT_NAME} — Admin Alert`,
    html: buildHtml("admin_alert", { message: options.message }),
    template: "admin_alert",
  });
}
