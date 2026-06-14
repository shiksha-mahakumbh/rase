import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { updateResearchSubmission } from "@/server/services/lifecycle/research.service";
import type { ResearchSubmissionStatus } from "@prisma/client";

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      status?: ResearchSubmissionStatus;
      reviewerUserId?: string;
      score?: number;
      remarks?: string;
      recommendation?: string;
      sendAcceptanceLetter?: boolean;
    }>(await request.json());
    return updateResearchSubmission(id, body);
  },
  { requireAdmin: true, rateLimitKey: "admin-research-update", limit: 30 }
);
