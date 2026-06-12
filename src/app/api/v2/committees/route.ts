import { NextRequest } from "next/server";
import type { CommitteeCategory, ContentLocale } from "@prisma/client";
import { createApiHandler } from "@/server/lib/api-handler";
import { listPublicCommittees } from "@/server/services/committee.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") ?? "en") as ContentLocale;
    const edition = searchParams.get("edition") ?? undefined;
    const category = searchParams.get("category") as CommitteeCategory | null;

    let items = await listPublicCommittees(locale, edition);
    if (category) {
      items = items.filter((c) => c.category === category);
    }

    return { success: true, items, total: items.length };
  },
  { rateLimitKey: "v2-committees-read", limit: 60 }
);
