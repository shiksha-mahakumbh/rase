import type { ContentLocale, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { data: unknown; expiresAt: number }>();

function cacheKey(locale: ContentLocale) {
  return `site_settings:${locale}`;
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export function invalidateSiteSettingsCache(locale?: ContentLocale) {
  if (locale) {
    cache.delete(cacheKey(locale));
    return;
  }
  cache.clear();
}

export type SiteSettingsInput = {
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
};

const DEFAULT_SETTINGS: SiteSettingsInput = {
  organizationName: "Department of Holistic Education (DHE)",
  tagline: "Shiksha Mahakumbh Abhiyan",
  phoneNumbers: [],
  officeAddresses: [],
  socialLinks: {},
  registrationOpen: true,
  maintenanceMode: false,
  extra: {},
};

export async function getSiteSettings(locale: ContentLocale = "en", useCache = true) {
  const key = cacheKey(locale);
  if (useCache) {
    const cached = getCached<Awaited<ReturnType<typeof prisma.siteSetting.findUnique>>>(key);
    if (cached) return cached;
  }

  let settings = await prisma.siteSetting.findUnique({ where: { locale } });

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: { locale, ...DEFAULT_SETTINGS },
    });
  }

  setCache(key, settings);
  return settings;
}

export async function upsertSiteSettings(
  input: SiteSettingsInput,
  locale: ContentLocale = "en",
  userId?: string
) {
  const settings = await prisma.siteSetting.upsert({
    where: { locale },
    create: { locale, ...DEFAULT_SETTINGS, ...input },
    update: input,
  });

  invalidateSiteSettingsCache(locale);

  await writeAuditLog({
    action: "settings_updated",
    entityType: "site_settings",
    entityId: settings.id,
    actorUserId: userId ?? null,
    payload: { locale },
  });

  return settings;
}

export async function getPublicSiteConfig(locale: ContentLocale = "en") {
  const settings = await getSiteSettings(locale);
  return {
    organizationName: settings.organizationName,
    tagline: settings.tagline,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    contactEmail: settings.contactEmail,
    supportEmail: settings.supportEmail,
    phoneNumbers: settings.phoneNumbers,
    officeAddresses: settings.officeAddresses,
    socialLinks: settings.socialLinks,
    copyrightText: settings.copyrightText,
    footerContent: settings.footerContent,
    registrationOpen: settings.registrationOpen,
    maintenanceMode: settings.maintenanceMode,
  };
}
