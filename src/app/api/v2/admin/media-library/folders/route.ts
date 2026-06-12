import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createFolder, listFolders } from "@/server/services/media-library.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const parentId = new URL(request.url).searchParams.get("parentId");
    const folders = await listFolders(parentId === "null" ? null : parentId ?? null);
    return { success: true, folders };
  },
  { requireAdmin: true }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      name: string;
      slug?: string;
      parentId?: string;
      sortOrder?: number;
    }>(await request.json());
    const folder = await createFolder(body);
    return { success: true, folder };
  },
  { requireAdmin: true }
);
