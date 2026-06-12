import type { ContentLocale, PageStatus, PartnerCategory, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { saveEntityRevision } from "@/server/services/entity-revision.service";
import { upsertSeoForEntity } from "@/server/services/seo.service";
import { ServiceError } from "@/server/lib/errors";
import { isPublishedStatus } from "@/server/lib/cms-utils";

export async function createPartner(input: {
  name: string;
  slug?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  partnerCategory?: PartnerCategory;
  locale?: ContentLocale;
  status?: PageStatus;
  isActive?: boolean;
  isFeatured?: boolean;
  mediaAssetId?: string;
  sortOrder?: number;
}) {
  const row = await prisma.partner.create({
    data: {
      name: input.name.trim(),
      slug: input.slug ?? null,
      logoUrl: input.logoUrl ?? null,
      website: input.website ?? null,
      description: input.description ?? null,
      partnerCategory: input.partnerCategory ?? "other",
      locale: input.locale ?? "en",
      status: input.status ?? "draft",
      isActive: input.isActive ?? true,
      isFeatured: input.isFeatured ?? false,
      mediaAssetId: input.mediaAssetId ?? null,
      sortOrder: input.sortOrder ?? 0,
    },
  });

  await writeAuditLog({
    action: "admin_action",
    entityType: "partners",
    entityId: row.id,
    payload: { event: "partner_created", name: row.name },
  });

  return row;
}

export async function updatePartner(
  id: string,
  data: Prisma.PartnerUpdateInput & {
    seo?: { seoTitle?: string; metaDescription?: string; canonicalUrl?: string; ogImageUrl?: string };
  }
) {
  const existing = await prisma.partner.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("Partner not found", 404, "NOT_FOUND");

  const { seo, ...rest } = data;
  await saveEntityRevision({
    entityType: "partner",
    entityId: id,
    snapshot: existing as unknown as Prisma.InputJsonValue,
  });

  const row = await prisma.partner.update({ where: { id }, data: rest });

  if (seo) {
    await upsertSeoForEntity({
      entityType: "partner",
      entityId: row.id,
      locale: row.locale,
      ...seo,
    });
  }

  await writeAuditLog({
    action: "admin_action",
    entityType: "partners",
    entityId: id,
    payload: { event: "partner_updated" },
  });

  return row;
}

export async function publishPartner(id: string) {
  const row = await prisma.partner.update({
    where: { id },
    data: { status: "published", isActive: true },
  });
  await writeAuditLog({
    action: "admin_action",
    entityType: "partners",
    entityId: id,
    payload: { event: "partner_published" },
  });
  return row;
}

export async function archivePartner(id: string) {
  return prisma.partner.update({
    where: { id },
    data: { status: "archived", isActive: false },
  });
}

export async function deletePartner(id: string) {
  const row = await prisma.partner.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived", isActive: false },
  });
  await writeAuditLog({
    action: "admin_action",
    entityType: "partners",
    entityId: id,
    payload: { event: "partner_deleted" },
  });
  return row;
}

export async function getPartner(id: string) {
  const row = await prisma.partner.findFirst({ where: { id, deletedAt: null } });
  if (!row) throw new ServiceError("Partner not found", 404, "NOT_FOUND");
  return row;
}

export async function listPartners(options: {
  status?: PageStatus;
  locale?: ContentLocale;
  partnerCategory?: PartnerCategory;
  isActive?: boolean;
  featured?: boolean;
  limit?: number;
  offset?: number;
} = {}) {
  const { limit = 25, offset = 0 } = options;
  const where: Prisma.PartnerWhereInput = {
    deletedAt: null,
    ...(options.status ? { status: options.status } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.partnerCategory ? { partnerCategory: options.partnerCategory } : {}),
    ...(options.isActive !== undefined ? { isActive: options.isActive } : {}),
    ...(options.featured !== undefined ? { isFeatured: options.featured } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.partner.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: limit,
      skip: offset,
    }),
    prisma.partner.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function listPublicPartners(
  locale: ContentLocale = "en",
  category?: PartnerCategory
) {
  const items = await prisma.partner.findMany({
    where: {
      deletedAt: null,
      locale,
      status: "published",
      isActive: true,
      ...(category ? { partnerCategory: category } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
  });
  return items;
}
