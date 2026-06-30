import type { AnnouncementBarType, ContentLocale, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { isAnnouncementBarActive } from "@/server/lib/cms-utils";
import { purgeCmsContentCaches } from "@/server/lib/cms-cache-purge";

export type CreateAnnouncementBarInput = {
  title: string;
  message: string;
  barType?: AnnouncementBarType;
  colorTheme?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  locale?: ContentLocale;
  isDismissible?: boolean;
  isActive?: boolean;
  priority?: number;
  startsAt?: Date;
  endsAt?: Date;
};

function activeBarWhere(now = new Date()): Prisma.AnnouncementBarWhereInput {
  return {
    deletedAt: null,
    isActive: true,
    AND: [
      { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
      { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
    ],
  };
}

export async function createAnnouncementBar(input: CreateAnnouncementBarInput) {
  const bar = await prisma.announcementBar.create({
    data: {
      title: input.title,
      message: input.message,
      barType: input.barType ?? "global",
      colorTheme: input.colorTheme ?? "primary",
      ctaLabel: input.ctaLabel ?? null,
      ctaUrl: input.ctaUrl ?? null,
      locale: input.locale ?? "en",
      isDismissible: input.isDismissible ?? true,
      isActive: input.isActive ?? true,
      priority: input.priority ?? 0,
      startsAt: input.startsAt ?? null,
      endsAt: input.endsAt ?? null,
    },
  });
  purgeCmsContentCaches({ locales: [bar.locale] });
  return bar;
}

export async function updateAnnouncementBar(
  id: string,
  data: Prisma.AnnouncementBarUpdateInput,
  userId?: string
) {
  const bar = await prisma.announcementBar.update({ where: { id }, data });

  await writeAuditLog({
    action: "announcement_bar_updated",
    entityType: "announcement_bars",
    entityId: bar.id,
    actorUserId: userId ?? null,
    payload: { title: bar.title },
  });

  purgeCmsContentCaches({ locales: [bar.locale] });

  return bar;
}

export async function deleteAnnouncementBar(id: string) {
  const bar = await prisma.announcementBar.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  });
  purgeCmsContentCaches({ locales: [bar.locale] });
  return bar;
}

export async function listActiveAnnouncementBars(locale: ContentLocale = "en") {
  const items = await prisma.announcementBar.findMany({
    where: { ...activeBarWhere(), locale },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return items.filter((bar) => isAnnouncementBarActive(bar));
}

export async function listAnnouncementBars(options: {
  locale?: ContentLocale;
  barType?: AnnouncementBarType;
  includeInactive?: boolean;
  limit?: number;
  offset?: number;
}) {
  const { limit = 25, offset = 0, includeInactive = false } = options;
  const where: Prisma.AnnouncementBarWhereInput = {
    deletedAt: null,
    ...(options.locale ? { locale: options.locale } : {}),
    ...(options.barType ? { barType: options.barType } : {}),
    ...(includeInactive ? {} : {}),
  };

  const [items, total] = await Promise.all([
    prisma.announcementBar.findMany({
      where,
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.announcementBar.count({ where }),
  ]);

  return { items, total, limit, offset };
}
