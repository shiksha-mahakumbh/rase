import { NextRequest } from "next/server";
import type { ContentLocale, Prisma } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getSiteSettings, upsertSiteSettings } from "@/server/services/site-settings.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const locale = (new URL(request.url).searchParams.get("locale") ?? "en") as ContentLocale;
    const settings = await getSiteSettings(locale, false);
    return { success: true, settings };
  },
  { requireAdmin: true, adminResource: "settings" }
);

export const PUT = createApiHandler(
  async (request: NextRequest) => {
    const body = assertBody<{
      locale?: ContentLocale;
      organizationName?: string;
      tagline?: string;
      logoUrl?: string;
      faviconUrl?: string;
      contactEmail?: string;
      supportEmail?: string;
      phoneNumbers?: Prisma.InputJsonValue;
      officeAddresses?: Prisma.InputJsonValue;
      socialLinks?: Prisma.InputJsonValue;
      copyrightText?: string;
      footerContent?: Prisma.InputJsonValue;
      registrationOpen?: boolean;
      maintenanceMode?: boolean;
      extra?: Prisma.InputJsonValue;
    }>(await request.json());

    const { locale, ...data } = body;
    const settings = await upsertSiteSettings(data, locale ?? "en");
    return { success: true, settings };
  },
  { requireAdmin: true, adminResource: "settings" }
);
