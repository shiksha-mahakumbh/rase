import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { ServiceError } from "@/server/lib/errors";
import {
  listResearchSubmissions,
  createResearchSubmission,
} from "@/server/services/lifecycle/research.service";
import type { ResearchSubmissionStatus } from "@prisma/client";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listResearchSubmissions({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      status: (searchParams.get("status") as ResearchSubmissionStatus) ?? undefined,
      reviewerUserId: searchParams.get("reviewerUserId") ?? undefined,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-research", limit: 60 }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      title?: string;
      authorName?: string;
      authorEmail?: string;
      institution?: string;
      abstractText?: string;
      registrationId?: string;
    }>(await request.json());
    if (!body.title || !body.authorName || !body.authorEmail || !body.abstractText) {
      throw new ServiceError("title, authorName, authorEmail, abstractText required", 400, "INVALID_BODY");
    }
    return createResearchSubmission({
      title: body.title,
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      institution: body.institution,
      abstractText: body.abstractText,
      registrationId: body.registrationId,
    });
  },
  { requireAdmin: true, rateLimitKey: "admin-research-create", limit: 20 }
);
