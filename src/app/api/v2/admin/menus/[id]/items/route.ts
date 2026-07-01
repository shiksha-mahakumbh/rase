import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { upsertMenuItem, reorderMenuItems, deleteMenuItem } from "@/server/services/menu.service";

export const POST = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id: menuId } = await context.params;
    const body = assertBody<{
      id?: string;
      parentId?: string | null;
      label: string;
      url: string;
      isExternal?: boolean;
      openInNewTab?: boolean;
      icon?: string;
      sortOrder?: number;
      isVisible?: boolean;
    }>(await request.json());

    const item = await upsertMenuItem(menuId, body);
    return { success: true, item };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const PUT = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id: menuId } = await context.params;
    const body = assertBody<{
      items: Array<{ id: string; sortOrder: number; parentId?: string | null }>;
    }>(await request.json());

    const menu = await reorderMenuItems(menuId, body.items);
    return { success: true, menu };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const DELETE = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    if (!itemId) return { success: false, error: "itemId required" };
    const item = await deleteMenuItem(itemId);
    return { success: true, item };
  },
  { requireAdmin: true, adminResource: "media" }
);
