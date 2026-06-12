import { NextRequest } from "next/server";
import type { AlbumType, PageStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  deleteMediaAlbum,
  getMediaAlbum,
  updateMediaAlbum,
} from "@/server/services/media-album.service";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const album = await getMediaAlbum(id);
    return { success: true, album };
  },
  { requireAdmin: true }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      title?: string;
      slug?: string;
      description?: string;
      albumType?: AlbumType;
      edition?: string;
      year?: number;
      status?: PageStatus;
      sortOrder?: number;
      items?: Array<Record<string, unknown>>;
    }>(await request.json());

    const album = await updateMediaAlbum(id, {
      ...body,
      items: body.items as never,
    });
    return { success: true, album };
  },
  { requireAdmin: true }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    await deleteMediaAlbum(id);
    return { success: true };
  },
  { requireAdmin: true }
);
