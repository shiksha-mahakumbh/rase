import { NextRequest } from "next/server";
import type { WorkflowTrigger } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  listWorkflowRules,
  upsertWorkflowRule,
  toggleWorkflowRule,
} from "@/server/services/ops/workflow-automation.service";

export const GET = createApiHandler(async () => listWorkflowRules(), { requireAdmin: true });

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

    if (!body.name || !body.trigger) throw new Error("name and trigger required");
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
  { requireAdmin: true, rateLimitKey: "admin-workflows", limit: 30 }
);
