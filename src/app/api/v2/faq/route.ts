import { NextRequest } from "next/server";
import type { ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPublicFaqs } from "@/server/services/faq.service";

export const GET = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get("locale") as ContentLocale) ?? "en";
  return listPublicFaqs(locale);
});
