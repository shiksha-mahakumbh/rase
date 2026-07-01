import type { ContentLocale } from "@prisma/client";
import { getCommitteeBySlug, listPublicCommittees } from "@/server/services/committee.service";
import { getSpeakerBySlug, listPublicSpeakers } from "@/server/services/speaker.service";
import { listPublicPartners } from "@/server/services/partner.service";
import { getEventBySlug, listPublicEvents } from "@/server/services/event-cms.service";
import {
  getMediaEntryBySlug,
  listPublicMediaCenterHub,
} from "@/server/services/media-center.service";
import type {
  CmsCommitteeCard,
  CmsEventCard,
  CmsLoadedCommittee,
  CmsLoadedEvent,
  CmsLoadedMediaEntry,
  CmsLoadedSpeaker,
  CmsMediaCenterItem,
  CmsPartnerCard,
  CmsSeoSnapshot,
  CmsSpeakerCard,
} from "./types";

type LooseRecord = Record<string, unknown>;

function asLoose<T extends LooseRecord>(value: unknown): T {
  return value as T;
}

function mapSeo(seo: {
  seoTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  robots?: string | null;
  schemaJsonLd?: unknown;
} | null): CmsSeoSnapshot | null {
  if (!seo) return null;
  return {
    seoTitle: seo.seoTitle,
    metaDescription: seo.metaDescription,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    ogImageUrl: seo.ogImageUrl,
    canonicalUrl: seo.canonicalUrl,
    robots: seo.robots,
    schemaJsonLd: seo.schemaJsonLd as CmsSeoSnapshot["schemaJsonLd"],
  };
}

export async function loadCmsCommittees(
  locale: ContentLocale = "en",
  edition?: string
): Promise<CmsCommitteeCard[]> {
  try {
    const items = await listPublicCommittees(locale, edition);
    return items.map((raw) => {
      const c = asLoose<{ id: string; name: string; slug: string; edition?: string | null; description?: string | null; members?: unknown[] }>(raw);
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        edition: c.edition ?? null,
        description: c.description ?? null,
        href: `/committee/${c.slug}`,
        memberCount: Array.isArray(c.members) ? c.members.length : 0,
      };
    });
  } catch {
    return [];
  }
}

export async function loadCmsCommitteeBySlug(
  slug: string,
  locale: ContentLocale = "en",
  edition?: string | null
): Promise<CmsLoadedCommittee | null> {
  try {
    const result = await getCommitteeBySlug(slug, locale, edition);
    if (!result) return null;

    const { committee: rawCommittee, seo } = result;
    const committee = asLoose<{
      id: string;
      name: string;
      slug: string;
      edition?: string | null;
      description?: string | null;
      category: string;
      members: Array<{
        id: string;
        fullName: string;
        designation: string | null;
        institution: string | null;
        photoUrl: string | null;
        sortOrder: number;
      }>;
    }>(rawCommittee);
    return {
      id: committee.id,
      name: committee.name,
      slug: committee.slug,
      edition: committee.edition ?? null,
      description: committee.description ?? null,
      category: committee.category,
      members: (committee.members ?? []).map((m) => ({
        id: m.id,
        fullName: m.fullName,
        designation: m.designation,
        institution: m.institution,
        photoUrl: m.photoUrl,
        sortOrder: m.sortOrder,
      })),
      seo: mapSeo(seo),
    };
  } catch {
    return null;
  }
}

export async function loadCmsSpeakers(
  locale: ContentLocale = "en",
  featuredOnly = false
): Promise<CmsSpeakerCard[]> {
  try {
    const items = await listPublicSpeakers(locale, featuredOnly);
    return items.map((raw) => {
      const s = asLoose<{
        id: string;
        fullName: string;
        slug: string;
        title?: string | null;
        designation?: string | null;
        institution?: string | null;
        photoUrl?: string | null;
        isFeatured?: boolean;
      }>(raw);
      return {
        id: s.id,
        fullName: s.fullName,
        slug: s.slug,
        title: s.title ?? null,
        designation: s.designation ?? null,
        institution: s.institution ?? null,
        photoUrl: s.photoUrl ?? null,
        isFeatured: s.isFeatured ?? false,
        href: `/speakers/${s.slug}`,
      };
    });
  } catch {
    return [];
  }
}

export async function loadCmsSpeakerBySlug(
  slug: string,
  locale: ContentLocale = "en"
): Promise<CmsLoadedSpeaker | null> {
  try {
    const result = await getSpeakerBySlug(slug, locale);
    if (!result) return null;

    const { speaker: rawSpeaker, seo } = result;
    const speaker = asLoose<{
      id: string;
      fullName: string;
      slug: string;
      title?: string | null;
      designation?: string | null;
      institution?: string | null;
      country?: string | null;
      bio?: string | null;
      photoUrl?: string | null;
      topics?: string[];
      tags?: string[];
      languages?: string[];
      socialLinks?: Record<string, string>;
    }>(rawSpeaker);
    return {
      id: speaker.id,
      fullName: speaker.fullName,
      slug: speaker.slug,
      title: speaker.title ?? null,
      designation: speaker.designation ?? null,
      institution: speaker.institution ?? null,
      country: speaker.country ?? null,
      bio: speaker.bio ?? null,
      photoUrl: speaker.photoUrl ?? null,
      topics: speaker.topics ?? [],
      tags: speaker.tags ?? [],
      languages: speaker.languages ?? [],
      socialLinks: speaker.socialLinks ?? {},
      seo: mapSeo(seo),
    };
  } catch {
    return null;
  }
}

export async function loadCmsPartners(
  locale: ContentLocale = "en",
  category?: string
): Promise<CmsPartnerCard[]> {
  try {
    const items = await listPublicPartners(
      locale,
      category as Parameters<typeof listPublicPartners>[1]
    );
    return items.map((p) => ({
      id: p.id,
      name: p.name,
      slug: (p as { slug?: string | null }).slug ?? null,
      logoUrl: p.logoUrl,
      website: p.website,
      description: (p as { description?: string | null }).description ?? null,
      partnerCategory:
        (p as { partnerCategory?: string }).partnerCategory ?? p.category ?? "other",
      isFeatured: (p as { isFeatured?: boolean }).isFeatured ?? false,
    }));
  } catch {
    return [];
  }
}

export async function loadCmsEvents(
  locale: ContentLocale = "en",
  featuredOnly = false
): Promise<CmsEventCard[]> {
  try {
    const items = await listPublicEvents(locale, featuredOnly);
    return items.map((raw) => {
      const e = asLoose<{
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        edition?: string | null;
        venue?: string | null;
        location?: string | null;
        startDate?: Date | null;
        endDate?: Date | null;
        eventDate?: Date | null;
        bannerUrl?: string | null;
        registrationLink?: string | null;
        isFeatured?: boolean;
      }>(raw);
      return {
        id: e.id,
        title: e.title,
        slug: e.slug,
        description: e.description ?? null,
        edition: e.edition ?? null,
        venue: e.venue ?? null,
        location: e.location ?? null,
        startDate: e.startDate?.toISOString() ?? e.eventDate?.toISOString() ?? null,
        endDate: e.endDate?.toISOString() ?? null,
        bannerUrl: e.bannerUrl ?? null,
        registrationLink: e.registrationLink ?? null,
        isFeatured: e.isFeatured ?? false,
        href: `/events/${e.slug}`,
      };
    });
  } catch {
    return [];
  }
}

export async function loadCmsEventBySlug(
  slug: string,
  locale: ContentLocale = "en"
): Promise<CmsLoadedEvent | null> {
  try {
    const result = await getEventBySlug(slug, locale);
    if (!result) return null;

    const { event: rawEvent, seo } = result;
    const event = asLoose<{
      id: string;
      title: string;
      slug: string;
      description?: string | null;
      edition?: string | null;
      venue?: string | null;
      location?: string | null;
      startDate?: Date | null;
      endDate?: Date | null;
      eventDate?: Date | null;
      bannerUrl?: string | null;
      registrationLink?: string | null;
      highlights?: unknown;
      brochureDownload?: { fileUrl?: string | null } | null;
    }>(rawEvent);
    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      description: event.description ?? null,
      edition: event.edition ?? null,
      venue: event.venue ?? null,
      location: event.location ?? null,
      startDate: event.startDate?.toISOString() ?? event.eventDate?.toISOString() ?? null,
      endDate: event.endDate?.toISOString() ?? null,
      bannerUrl: event.bannerUrl ?? null,
      registrationLink: event.registrationLink ?? null,
      highlights: Array.isArray(event.highlights) ? event.highlights : [],
      brochureUrl: event.brochureDownload?.fileUrl ?? null,
      seo: mapSeo(seo),
    };
  } catch {
    return null;
  }
}

export async function loadCmsMediaCenterHub(
  locale: ContentLocale = "en",
  category?: string,
  limit = 50
): Promise<CmsMediaCenterItem[]> {
  try {
    const items = await listPublicMediaCenterHub(
      locale,
      category as Parameters<typeof listPublicMediaCenterHub>[1],
      limit
    );
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      category: item.category,
      href: item.href,
      imageUrl: item.imageUrl,
      publishedAt: item.publishedAt,
      isFeatured: item.isFeatured,
      tags: item.tags,
      source: item.source,
    }));
  } catch {
    return [];
  }
}

export async function loadCmsMediaEntryBySlug(
  slug: string,
  locale: ContentLocale = "en"
): Promise<CmsLoadedMediaEntry | null> {
  try {
    const result = await getMediaEntryBySlug(slug, locale);
    if (!result) return null;

    const { entry: rawEntry, seo } = result;
    const entry = asLoose<{
      id: string;
      title?: string | null;
      slug?: string | null;
      excerpt?: string | null;
      description?: string | null;
      url: string;
      mediaType?: string | null;
      mediaCenterCategory?: string | null;
      tags?: string[];
      publishAt?: Date | null;
      createdAt: Date;
    }>(rawEntry);
    if (!entry.slug) return null;

    return {
      id: entry.id,
      title: entry.title ?? "Media",
      slug: entry.slug,
      excerpt: entry.excerpt ?? null,
      description: entry.description ?? null,
      url: entry.url,
      mediaType: entry.mediaType ?? null,
      category: entry.mediaCenterCategory ?? null,
      tags: entry.tags ?? [],
      publishedAt: entry.publishAt?.toISOString() ?? entry.createdAt.toISOString(),
      seo: mapSeo(seo),
    };
  } catch {
    return null;
  }
}

import { formatEventDateRange } from "@/lib/cms/format-dates";

export { formatEventDateRange } from "@/lib/cms/format-dates";

export function mapCmsEventsToUpcoming(events: CmsEventCard[]) {
  return events.map((e) => ({
    title: e.title,
    date: formatEventDateRange(e.startDate, e.endDate),
    venue: e.venue ?? e.location ?? "TBA",
    href: e.href,
    registrationLink: e.registrationLink ?? "/registration",
  }));
}
