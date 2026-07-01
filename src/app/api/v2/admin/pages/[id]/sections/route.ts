import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { upsertPageSection } from "@/server/services/page.service";

export const PUT = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id: pageId } = await context.params;
    const body = assertBody<{
      sectionKey: string;
      sectionType?: string;
      title?: string;
      content?: Prisma.InputJsonValue;
      sortOrder?: number;
      isVisible?: boolean;
    }>(await request.json());

    const section = await upsertPageSection(pageId, body);
    return { success: true, section };
  },
  { requireAdmin: true, adminResource: "media" }
);
