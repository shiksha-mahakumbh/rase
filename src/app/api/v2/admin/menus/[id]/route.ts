import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { updateMenu } from "@/server/services/menu.service";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const menu = await prisma.menu.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
          include: { children: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
    if (!menu) throw new ServiceError("Menu not found", 404, "NOT_FOUND");
    return { success: true, menu };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      name?: string;
      isActive?: boolean;
    }>(await request.json());
    const menu = await updateMenu(id, body);
    return { success: true, menu };
  },
  { requireAdmin: true, adminResource: "media" }
);
