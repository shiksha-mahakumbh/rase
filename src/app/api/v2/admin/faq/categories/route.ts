import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  createFaqCategory,
  listFaqCategories,
  updateFaqCategory,
  deleteFaqCategory,
} from "@/server/services/faq.service";
import { ServiceError } from "@/server/lib/errors";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listFaqCategories({
      locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
      includeInactive: searchParams.get("includeInactive") === "true",
    });
  },
  { requireAdmin: true, adminResource: "media" }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      name: string;
      slug?: string;
      locale?: ContentLocale;
      sortOrder?: number;
      isActive?: boolean;
    }>(await request.json());

    const category = await createFaqCategory(body);
    return { success: true, category };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const PATCH = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      id: string;
      name?: string;
      slug?: string;
      sortOrder?: number;
      isActive?: boolean;
    }>(await request.json());

    const category = await updateFaqCategory(body.id, body);
    return { success: true, category };
  },
  { requireAdmin: true, adminResource: "media" }
);

export const DELETE = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) throw new ServiceError("id required", 400);
    await deleteFaqCategory(id);
    return { success: true };
  },
  { requireAdmin: true, adminResource: "media" }
);
