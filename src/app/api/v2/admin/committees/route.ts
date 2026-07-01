import { NextRequest } from "next/server";
import type { CommitteeCategory, ContentLocale, PageStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { createCommittee, listCommittees } from "@/server/services/committee.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listCommittees({
      status: (searchParams.get("status") as PageStatus) ?? undefined,
      locale: (searchParams.get("locale") as ContentLocale) ?? undefined,
      edition: searchParams.get("edition") ?? undefined,
      category: (searchParams.get("category") as CommitteeCategory) ?? undefined,
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
    });
  },
  { requireAdmin: true, adminResource: "committees" }
);

export const POST = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      name: string;
      slug?: string;
      category: CommitteeCategory;
      description?: string;
      edition?: string;
      locale?: ContentLocale;
      sortOrder?: number;
      status?: PageStatus;
      publishAt?: string;
      seo?: Record<string, unknown>;
    }>(await request.json());
    const committee = await createCommittee({
      ...body,
      publishAt: body.publishAt ? new Date(body.publishAt) : undefined,
      seo: body.seo as never,
    });
    return { success: true, committee };
  },
  { requireAdmin: true, adminResource: "committees" }
);
