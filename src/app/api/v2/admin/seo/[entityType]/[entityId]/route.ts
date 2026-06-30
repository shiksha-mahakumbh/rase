import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { upsertSeoForEntity, getSeoForEntity, deleteSeoForEntity } from "@/server/services/seo.service";
import { enrichSeoForAdmin, normalizeSeoBody } from "@/lib/seo/robots-meta";

export const GET = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ entityType: string; entityId: string }> }) => {
    const { entityType, entityId } = await context.params;
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const seo = await getSeoForEntity(entityType, entityId, locale);
    return { success: true, seo: enrichSeoForAdmin(seo) };
  },
  { requireAdmin: true }
);

export const PUT = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ entityType: string; entityId: string }> }) => {
    const { entityType, entityId } = await context.params;
    const body = assertBody<Record<string, unknown>>(await request.json());
    const normalized = normalizeSeoBody(body);
    const seo = await upsertSeoForEntity({
      entityType,
      entityId,
      ...normalized,
    } as never);
    return { success: true, seo: enrichSeoForAdmin(seo) };
  },
  { requireAdmin: true }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ entityType: string; entityId: string }> }) => {
    const { entityType, entityId } = await context.params;
    await deleteSeoForEntity(entityType, entityId);
    return { success: true };
  },
  { requireAdmin: true }
);
