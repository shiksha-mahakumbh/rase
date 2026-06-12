import type {
  CommitteeCategory,
  ContentLocale,
  PageStatus,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { saveEntityRevision } from "@/server/services/entity-revision.service";
import { upsertSeoForEntity } from "@/server/services/seo.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify, isPublishedStatus } from "@/server/lib/cms-utils";

export async function createCommittee(input: {
  name: string;
  slug?: string;
  category: CommitteeCategory;
  description?: string;
  edition?: string;
  locale?: ContentLocale;
  sortOrder?: number;
  status?: PageStatus;
  publishAt?: Date;
  seo?: { seoTitle?: string; metaDescription?: string; canonicalUrl?: string; ogImageUrl?: string };
}) {
  const slug = input.slug ?? slugify(input.name);
  const locale = input.locale ?? "en";
  const edition = input.edition ?? null;

  const existing = await prisma.committee.findFirst({
    where: { slug, edition, locale, deletedAt: null },
  });
  if (existing) throw new ServiceError("Committee slug already exists", 409, "SLUG_EXISTS");

  const row = await prisma.committee.create({
    data: {
      name: input.name.trim(),
      slug,
      category: input.category,
      description: input.description ?? null,
      edition,
      locale,
      sortOrder: input.sortOrder ?? 0,
      status: input.status ?? "draft",
      publishAt: input.publishAt ?? null,
      isPublished: input.status === "published",
    },
    include: { members: true },
  });

  if (input.seo) {
    await upsertSeoForEntity({
      entityType: "committee",
      entityId: row.id,
      locale,
      canonicalUrl: input.seo.canonicalUrl ?? `/committee/${slug}`,
      ...input.seo,
    });
  }

  await writeAuditLog({
    action: "admin_action",
    entityType: "committees",
    entityId: row.id,
    payload: { event: "committee_created", name: row.name },
  });

  return row;
}

export async function updateCommittee(
  id: string,
  data: Prisma.CommitteeUpdateInput & {
    seo?: { seoTitle?: string; metaDescription?: string; canonicalUrl?: string; ogImageUrl?: string };
  }
) {
  const existing = await prisma.committee.findFirst({
    where: { id, deletedAt: null },
    include: { members: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } } },
  });
  if (!existing) throw new ServiceError("Committee not found", 404, "NOT_FOUND");

  const { seo, ...rest } = data;
  await saveEntityRevision({
    entityType: "committee",
    entityId: id,
    snapshot: existing as unknown as Prisma.InputJsonValue,
  });

  const row = await prisma.committee.update({
    where: { id },
    data: rest,
    include: { members: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } } },
  });

  if (seo) {
    await upsertSeoForEntity({
      entityType: "committee",
      entityId: row.id,
      locale: row.locale,
      canonicalUrl: seo.canonicalUrl ?? `/committee/${row.slug}`,
      ...seo,
    });
  }

  await writeAuditLog({
    action: "admin_action",
    entityType: "committees",
    entityId: row.id,
    payload: { event: "committee_updated" },
  });

  return row;
}

export async function publishCommittee(id: string) {
  const row = await prisma.committee.update({
    where: { id },
    data: { status: "published", isPublished: true, publishAt: new Date() },
    include: { members: true },
  });
  await writeAuditLog({
    action: "admin_action",
    entityType: "committees",
    entityId: id,
    payload: { event: "committee_published" },
  });
  return row;
}

export async function archiveCommittee(id: string) {
  const row = await prisma.committee.update({
    where: { id },
    data: { status: "archived", isPublished: false },
  });
  await writeAuditLog({
    action: "admin_action",
    entityType: "committees",
    entityId: id,
    payload: { event: "committee_archived" },
  });
  return row;
}

export async function deleteCommittee(id: string) {
  const row = await prisma.committee.update({
    where: { id },
    data: { deletedAt: new Date(), status: "archived", isPublished: false },
  });
  await writeAuditLog({
    action: "admin_action",
    entityType: "committees",
    entityId: id,
    payload: { event: "committee_deleted" },
  });
  return row;
}

export async function getCommittee(id: string) {
  const row = await prisma.committee.findFirst({
    where: { id, deletedAt: null },
    include: { members: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } } },
  });
  if (!row) throw new ServiceError("Committee not found", 404, "NOT_FOUND");
  return row;
}

export async function listCommittees(options: {
  status?: PageStatus;
  locale?: ContentLocale;
  edition?: string;
  category?: CommitteeCategory;
  limit?: number;
  offset?: number;
} = {}) {
  const { limit = 50, offset = 0 } = options;
  const where: Prisma.CommitteeWhereInput = {
    deletedAt: null,
    ...(options.status ? { status: options.status } : {}),
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.edition ? { edition: options.edition } : {}),
    ...(options.category ? { category: options.category } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.committee.findMany({
      where,
      include: {
        members: { where: { deletedAt: null, isActive: true }, orderBy: { sortOrder: "asc" } },
        _count: { select: { members: { where: { deletedAt: null } } } },
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.committee.count({ where }),
  ]);

  return { items, total, limit, offset };
}

export async function getCommitteeBySlug(
  slug: string,
  locale: ContentLocale = "en",
  edition?: string | null
) {
  const row = await prisma.committee.findFirst({
    where: {
      slug,
      locale,
      deletedAt: null,
      ...(edition !== undefined ? { edition } : {}),
    },
    include: {
      members: {
        where: { deletedAt: null, isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  if (!row || !isPublishedStatus(row.status, row.publishAt)) return null;

  const seo = await prisma.seoMetadata.findUnique({
    where: {
      entityType_entityId_locale: { entityType: "committee", entityId: row.id, locale },
    },
  });

  return { committee: row, seo };
}

export async function addCommitteeMember(input: {
  committeeId: string;
  fullName: string;
  designation?: string;
  institution?: string;
  email?: string;
  phone?: string;
  socialLinks?: Record<string, string>;
  bio?: string;
  photoUrl?: string;
  mediaAssetId?: string;
  sortOrder?: number;
  locale?: ContentLocale;
}) {
  const row = await prisma.committeeMember.create({
    data: {
      committeeId: input.committeeId,
      fullName: input.fullName.trim(),
      designation: input.designation ?? null,
      institution: input.institution ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      socialLinks: input.socialLinks ?? {},
      bio: input.bio ?? null,
      photoUrl: input.photoUrl ?? null,
      mediaAssetId: input.mediaAssetId ?? null,
      sortOrder: input.sortOrder ?? 0,
      locale: input.locale ?? null,
    },
  });
  await writeAuditLog({
    action: "committee_member_added",
    entityType: "committee_members",
    entityId: row.id,
    payload: { committeeId: input.committeeId, fullName: input.fullName },
  });
  return row;
}

export async function updateCommitteeMember(
  id: string,
  data: Prisma.CommitteeMemberUpdateInput
) {
  const existing = await prisma.committeeMember.findFirst({ where: { id, deletedAt: null } });
  if (!existing) throw new ServiceError("Member not found", 404, "NOT_FOUND");

  await saveEntityRevision({
    entityType: "committee_member",
    entityId: id,
    snapshot: existing as unknown as Prisma.InputJsonValue,
  });

  const row = await prisma.committeeMember.update({ where: { id }, data });
  await writeAuditLog({
    action: "admin_action",
    entityType: "committee_members",
    entityId: id,
    payload: { event: "committee_member_updated" },
  });
  return row;
}

export async function removeCommitteeMember(id: string) {
  const row = await prisma.committeeMember.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  });
  await writeAuditLog({
    action: "committee_member_removed",
    entityType: "committee_members",
    entityId: row.id,
    payload: { committeeId: row.committeeId },
  });
  return row;
}

export async function reorderCommitteeMembers(committeeId: string, memberIds: string[]) {
  await prisma.$transaction(
    memberIds.map((id, index) =>
      prisma.committeeMember.update({
        where: { id, committeeId },
        data: { sortOrder: index },
      })
    )
  );
  return { success: true };
}

export async function toggleCommitteeMemberActive(id: string, isActive: boolean) {
  return prisma.committeeMember.update({ where: { id }, data: { isActive } });
}

export async function listPublicCommittees(locale: ContentLocale = "en", edition?: string) {
  const items = await prisma.committee.findMany({
    where: {
      deletedAt: null,
      locale,
      status: "published",
      ...(edition ? { edition } : {}),
    },
    include: {
      members: {
        where: { deletedAt: null, isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });
  return items.filter((c) => isPublishedStatus(c.status, c.publishAt));
}
