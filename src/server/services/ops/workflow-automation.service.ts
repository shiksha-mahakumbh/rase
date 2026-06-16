import type { WorkflowTrigger } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { queueEmail } from "@/server/services/email.service";
import { sendWhatsAppMessage } from "@/server/services/ops/whatsapp.service";
import { EVENT_NAME } from "@/types/registration";
import { SITE_URL } from "@/config/site";

/** Registration emails are sent only by sendRegistrationCompleteEmail() on submit */
const REGISTRATION_EMAIL_TRIGGERS: WorkflowTrigger[] = [
  "registration_complete",
  "payment_complete",
];

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

export async function listWorkflowRules() {
  return prisma.workflowRule.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
}

export async function upsertWorkflowRule(input: {
  id?: string;
  name: string;
  trigger: WorkflowTrigger;
  channel: "email" | "whatsapp" | "both";
  isEnabled?: boolean;
  templateSubject?: string;
  templateBody?: string;
}) {
  if (input.id) {
    return prisma.workflowRule.update({
      where: { id: input.id },
      data: {
        name: input.name.trim(),
        trigger: input.trigger,
        channel: input.channel,
        isEnabled: input.isEnabled ?? true,
        templateSubject: input.templateSubject,
        templateBody: input.templateBody,
      },
    });
  }
  return prisma.workflowRule.create({
    data: {
      name: input.name.trim(),
      trigger: input.trigger,
      channel: input.channel,
      isEnabled: input.isEnabled ?? true,
      templateSubject: input.templateSubject,
      templateBody: input.templateBody,
    },
  });
}

export async function toggleWorkflowRule(id: string, isEnabled: boolean) {
  return prisma.workflowRule.update({ where: { id }, data: { isEnabled } });
}

export async function triggerWorkflows(
  trigger: WorkflowTrigger,
  context: {
    registrationUuid?: string;
    email?: string;
    phone?: string;
    vars?: Record<string, string>;
  }
) {
  const rules = await prisma.workflowRule.findMany({
    where: { trigger, isEnabled: true },
    orderBy: { sortOrder: "asc" },
  });

  const vars = context.vars ?? {};
  const results: Array<{ ruleId: string; channel: string; ok: boolean }> = [];

  for (const rule of rules) {
    const subject = interpolate(rule.templateSubject ?? rule.name, vars);
    const body = interpolate(rule.templateBody ?? `<p>${rule.name}</p>`, vars);
    const html = body.includes("<") ? body : `<p>${body.replace(/\n/g, "<br/>")}</p>`;

    if (
      (rule.channel === "email" || rule.channel === "both") &&
      context.email &&
      !REGISTRATION_EMAIL_TRIGGERS.includes(trigger)
    ) {
      try {
        await queueEmail({
          toEmail: context.email,
          subject,
          html,
          template: "registration_confirmation",
          publicRegistrationId: context.vars?.registrationId,
          registrationUuid: context.registrationUuid,
        });
        results.push({ ruleId: rule.id, channel: "email", ok: true });
      } catch {
        results.push({ ruleId: rule.id, channel: "email", ok: false });
      }
    }

    if ((rule.channel === "whatsapp" || rule.channel === "both") && context.phone) {
      const wa = await sendWhatsAppMessage({
        phone: context.phone,
        template: trigger,
        body: body.replace(/<[^>]+>/g, ""),
        registrationId: context.registrationUuid,
      });
      results.push({ ruleId: rule.id, channel: "whatsapp", ok: wa.ok });
    }
  }

  if (results.length) {
    await writeAuditLog({
      action: "workflow_triggered",
      registrationId: context.registrationUuid,
      payload: { trigger, results },
    });
  }

  return results;
}

export async function buildRegistrationContext(registrationUuid: string) {
  const reg = await prisma.registration.findUnique({
    where: { id: registrationUuid },
    include: {
      accommodationRequest: { include: { room: true } },
      attendeeCertificate: true,
    },
  });
  if (!reg) return null;

  const certUrl = reg.attendeeCertificate
    ? `${SITE_URL}/certificate/verify/${reg.attendeeCertificate.verifyCode}`
    : "";

  return {
    registrationUuid: reg.id,
    registrationId: reg.registrationId,
    fullName: reg.fullName,
    email: reg.email,
    phone: reg.whatsappNumber ?? reg.contactNumber,
    category: String(reg.registrationType),
    building: reg.accommodationRequest?.building ?? reg.accommodationRequest?.room?.building ?? "",
    roomNumber: reg.accommodationRequest?.roomNumber ?? reg.accommodationRequest?.room?.roomNumber ?? "",
    certificateUrl: certUrl,
    eventName: EVENT_NAME,
  };
}

export async function fireWorkflowForRegistration(trigger: WorkflowTrigger, registrationUuid: string) {
  const ctx = await buildRegistrationContext(registrationUuid);
  if (!ctx) return [];
  return triggerWorkflows(trigger, {
    registrationUuid: ctx.registrationUuid,
    email: ctx.email,
    phone: ctx.phone,
    vars: {
      registrationId: ctx.registrationId,
      fullName: ctx.fullName,
      email: ctx.email,
      category: ctx.category,
      building: ctx.building,
      roomNumber: ctx.roomNumber,
      certificateUrl: ctx.certificateUrl,
      eventName: ctx.eventName,
    },
  });
}
