import { NextRequest } from "next/server";
import type { WorkflowTrigger } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { ServiceError } from "@/server/lib/errors";
import {
  listWorkflowRules,
  upsertWorkflowRule,
  toggleWorkflowRule,
} from "@/server/services/ops/workflow-automation.service";

export const GET = createApiHandler(async () => listWorkflowRules(), { requireAdmin: true, adminResource: "media" });

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      action?: string;
      id?: string;
      name?: string;
      trigger?: WorkflowTrigger;
      channel?: "email" | "whatsapp" | "both";
      isEnabled?: boolean;
      templateSubject?: string;
      templateBody?: string;
    }>(await request.json());

    if (body.action === "toggle" && body.id) {
      return toggleWorkflowRule(body.id, body.isEnabled ?? true);
    }

    if (!body.name || !body.trigger) throw new ServiceError("name and trigger required", 400, "INVALID_BODY");
    return upsertWorkflowRule({
      id: body.id,
      name: body.name,
      trigger: body.trigger,
      channel: body.channel ?? "email",
      isEnabled: body.isEnabled,
      templateSubject: body.templateSubject,
      templateBody: body.templateBody,
    });
  },
  { requireAdmin: true, adminResource: "media", rateLimitKey: "admin-workflows", limit: 30 }
);
