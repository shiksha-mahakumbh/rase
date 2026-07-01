import { NextRequest } from "next/server";
import type { CommitteeCategory, ContentLocale, PageStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  getCommittee,
  updateCommittee,
  publishCommittee,
  archiveCommittee,
  deleteCommittee,
} from "@/server/services/committee.service";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const committee = await getCommittee(id);
    return { success: true, committee };
  },
  { requireAdmin: true, adminResource: "committees" }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      action?: "publish" | "archive";
      name?: string;
      slug?: string;
      category?: CommitteeCategory;
      description?: string;
      edition?: string;
      locale?: ContentLocale;
      sortOrder?: number;
      status?: PageStatus;
      publishAt?: string;
      seo?: Record<string, unknown>;
    }>(await request.json());

    if (body.action === "publish") {
      const committee = await publishCommittee(id);
      return { success: true, committee };
    }
    if (body.action === "archive") {
      const committee = await archiveCommittee(id);
      return { success: true, committee };
    }

    const { action: _a, publishAt, seo, ...rest } = body;
    const committee = await updateCommittee(id, {
      ...rest,
      ...(publishAt ? { publishAt: new Date(publishAt) } : {}),
      seo: seo as never,
    } as Parameters<typeof updateCommittee>[1]);
    return { success: true, committee };
  },
  { requireAdmin: true, adminResource: "committees" }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const committee = await deleteCommittee(id);
    return { success: true, committee };
  },
  { requireAdmin: true, adminResource: "committees" }
);
