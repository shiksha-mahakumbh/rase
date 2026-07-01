import { NextRequest } from "next/server";
import type { FeedbackStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getFeedback, updateFeedback } from "@/server/services/feedback.service";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const feedback = await getFeedback(id);
    return { success: true, feedback };
  },
  { requireAdmin: true, adminResource: "feedback" }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      status?: FeedbackStatus;
      adminReply?: string;
    }>(await request.json());

    const feedback = await updateFeedback(id, body);
    return { success: true, feedback };
  },
  { requireAdmin: true, adminResource: "feedback" }
);
