import type { ContentLocale, PageStatus, Prisma, SpeakerCategory } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { saveEntityRevision } from "@/server/services/entity-revision.service";
import { upsertSeoForEntity } from "@/server/services/seo.service";
import { buildPersonSchema } from "@/lib/seo/schema/builders";
import { ServiceError } from "@/server/lib/errors";
import { slugify, isPublishedStatus } from "@/server/lib/cms-utils";

export async function createSpeaker(input: {
  fullName: string;
  slug?: string;
  title?: string;
  designation?: string;
  institution?: string;
  country?: string;
  bio?: string;
  photoUrl?: string;
  mediaAssetId?: string;
  category?: SpeakerCategory;
  edition?: string;
  locale?: ContentLocale;
  status?: PageStatus;
  publishAt?: Date;
  socialLinks?: Record<string, string>;
  topics?: string[];
  tags?: string[];
  languages?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
}) {
  const slug = input.slug ?? slugify(input.fullName);
  const locale = input.locale ?? "en";

  const existing = await prisma.speakerProfile.findFirst({
    where: { slug, locale, deletedAt: null },
  });
  if (existing) throw new ServiceError("Speaker slug already exists", 409, "SLUG_EXISTS");

  const row = await prisma.speakerProfile.create({
    data: {
      slug,
      fullName: input.fullName.trim(),
      title: input.title ?? null,
      designation: input.designation ?? null,
      institution: input.institution ?? null,
      country: input.country ?? null,
      bio: input.bio ?? null,
      photoUrl: input.photoUrl ?? null,
      mediaAssetId: input.mediaAssetId ?? null,
      category: input.category ?? "other",
      edition: input.edition ?? null,
      locale,
      status: input.status ?? "draft",
      publishAt: input.publishAt ?? null,
      socialLinks: input.socialLinks ?? {},
      topics: input.topics ?? [],
      tags: input.tags ?? [],
      languages: input.languages ?? [],
      isFeatured: input.isFeatured ?? false,
      sortOrder: input.sortOrder ?? 0,
    },
  });

  await writeAuditLog({
    action: "admin_action",
    entityType: "speaker_profiles",
    entityId: row.id,
    payload: { event: "speaker_created", fullName: row.fullName },
  });

  return row;
}

export async function updateSpeaker(
  id: string,
  data: Prisma.SpeakerProfileUpdateInput & {
    seo?: { seoTitle?: string; metaDescription?: string; canonicalUrl?: string; ogImageUrl?: string };
  }
) {
  const existing = await prisma.speakerProfile.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("Speaker not found", 404, "NOT_FOUND");

  const { seo, ...rest } = data;
  await saveEntityRevision({
    entityType: "speaker",
    entityId: id,
    snapshot: existing as unknown as Prisma.InputJsonValue,
  });

  const row = await prisma.speakerProfile.update({ where: { id }, data: rest });

  if (seo) {
    await upsertSeoForEntity({
      entityType: "speaker",
      entityId: row.id,
      locale: row.locale,
      canonicalUrl: seo.canonicalUrl ?? `/speakers/${row.slug}`,
      schemaJsonLd: buildPersonSchema({
        name: row.fullName,
        jobTitle: row.designation ?? row.title ?? undefined,
        worksFor: row.institution ?? undefined,
        url: `/speakers/${row.slug}`,
      }) as Prisma.InputJsonValue,
      ...seo,
    });
  }

  await writeAuditLog({
    action: "admin_action",
    entityType: "speaker_profiles",
    entityId: id,
    payload: { event: "speaker_updated" },
  });

  return row;
}

export async function publishSpeaker(id: string) {
  const row = await prisma.speakerProfile.update({
    where: { id },
    data: { status: "published", publishAt: new Date() },
  });
  await writeAuditLog({
    action: "admin_action",
    entityType: "speaker_profiles",
    entityId: id,
    payload: { event: "speaker_published" },
  });
  return row;
}

export async function archiveSpeaker(id: string) {
  return prisma.speakerProfile.update({
    where: { id },
    data: { status: "archived" },
  });
}

export async function deleteSpeaker(id: string) {
  const row = await prisma.speakerProfile.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived" },
  });
  await writeAuditLog({
    action: "admin_action",
    entityType: "speaker_profiles",
    entityId: id,
    payload: { event: "speaker_deleted" },
  });
  return row;
}

export async function getSpeaker(id: string) {
  const row = await prisma.speakerProfile.findFirst({ where: { id, deletedAt: null } });
  if (!row) throw new ServiceError("Speaker not found", 404, "NOT_FOUND");
  return row;
}

export async function listSpeakers(options: {
  status?: PageStatus;
  locale?: ContentLocale;
  category?: SpeakerCategory;
  featured?: boolean;
  limit?: number;
  offset?: number;
} = {}) {
  const { limit = 25, offset = 0 } = options;
  const where: Prisma.SpeakerProfileWhereInput = {
    deletedAt: null,
    ...(options.status ? { status: options.status } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.category ? { category: options.category } : {}),
    ...(options.featured !== undefined ? { isFeatured: options.featured } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.speakerProfile.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { fullName: "asc" }],
      take: limit,
      skip: offset,
    }),
    prisma.speakerProfile.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function getSpeakerBySlug(slug: string, locale: ContentLocale = "en") {
  const row = await prisma.speakerProfile.findFirst({
    where: { slug, locale, deletedAt: null },
  });
  if (!row || !isPublishedStatus(row.status, row.publishAt)) return null;

  const seo = await prisma.seoMetadata.findUnique({
    where: {
      entityType_entityId_locale: { entityType: "speaker", entityId: row.id, locale },
    },
  });

  return { speaker: row, seo };
}

export async function listPublicSpeakers(locale: ContentLocale = "en", featuredOnly = false) {
  const items = await prisma.speakerProfile.findMany({
    where: {
      deletedAt: null,
      locale,
      status: "published",
      ...(featuredOnly ? { isFeatured: true } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
  });
  return items.filter((s) => isPublishedStatus(s.status, s.publishAt));
}
