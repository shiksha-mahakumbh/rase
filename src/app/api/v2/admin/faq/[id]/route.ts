import { NextRequest } from "next/server";
import type { ContentLocale, FaqStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { updateFaq, deleteFaq } from "@/server/services/faq.service";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const faq = await prisma.faq.findFirst({
      where: { id, deletedAt: null },
      include: { category: true },
    });
    if (!faq) throw new ServiceError("FAQ not found", 404, "NOT_FOUND");
    return { success: true, faq };
  },
  { requireAdmin: true }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      question?: string;
      answer?: string;
      categoryId?: string | null;
      locale?: ContentLocale;
      isFeatured?: boolean;
      sortOrder?: number;
      status?: FaqStatus;
    }>(await request.json());

    const faq = await updateFaq(id, body);
    return { success: true, faq };
  },
  { requireAdmin: true }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await deleteFaq(id);
    return { success: true };
  },
  { requireAdmin: true }
);
