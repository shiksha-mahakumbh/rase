import { NextRequest } from "next/server";
import type { ContentLocale, FaqStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createFaq, listFaqs } from "@/server/services/faq.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listFaqs({
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
      status: (searchParams.get("status") as FaqStatus) ?? undefined,
      locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
      featured: searchParams.get("featured") === "true" ? true : undefined,
    });
  },
  { requireAdmin: true }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      question: string;
      answer: string;
      categoryId?: string;
      locale?: ContentLocale;
      isFeatured?: boolean;
      sortOrder?: number;
      status?: FaqStatus;
    }>(await request.json());

    const faq = await createFaq(body);
    return { success: true, faq };
  },
  { requireAdmin: true }
);
