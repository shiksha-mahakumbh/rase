import type { ContentLocale, MenuType, Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { writeAuditLog } from "@/server/services/audit.service";
import { ServiceError } from "@/server/lib/errors";
import { slugify } from "@/server/lib/cms-utils";
import { purgeCmsContentCaches } from "@/server/lib/cms-cache-purge";

async function purgeMenuCache(menuId: string) {
  const menu = await prisma.menu.findUnique({ where: { id: menuId }, select: { locale: true } });
  if (menu) purgeCmsContentCaches({ locales: [menu.locale] });
}

export async function createMenu(input: {
  name: string;
  slug?: string;
  menuType: MenuType;
  locale?: ContentLocale;
}) {
  const locale = input.locale ?? "en";
  const slug = input.slug ?? slugify(input.name);

  const existing = await prisma.menu.findFirst({
    where: { slug, locale, deletedAt: null },
  });
  if (existing) throw new ServiceError("Menu slug already exists", 409, "SLUG_EXISTS");

  return prisma.menu.create({
    data: {
      name: input.name,
      slug,
      menuType: input.menuType,
      locale,
    },
  }).then((menu) => {
    purgeCmsContentCaches({ locales: [locale] });
    return menu;
  });
}

export async function getMenuBySlug(slug: string, locale: ContentLocale = "en") {
  const menu = await prisma.menu.findFirst({
    where: { slug, locale, deletedAt: null, isActive: true },
    include: {
      items: {
        where: { isVisible: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        include: {
          children: {
            where: { isVisible: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  return menu;
}

export async function getMenuByType(menuType: MenuType, locale: ContentLocale = "en") {
  const menu = await prisma.menu.findFirst({
    where: { menuType, locale, deletedAt: null, isActive: true },
    include: {
      items: {
        where: { isVisible: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        include: {
          children: {
            where: { isVisible: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  return menu;
}

export async function listMenus(locale?: ContentLocale, includeInactive = false) {
  return prisma.menu.findMany({
    where: {
      deletedAt: null,
      ...(locale ? { locale } : {}),
      ...(includeInactive ? {} : { isActive: true }),
    },
    orderBy: { name: "asc" },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function upsertMenuItem(
  menuId: string,
  input: {
    id?: string;
    parentId?: string | null;
    label: string;
    url: string;
    isExternal?: boolean;
    openInNewTab?: boolean;
    icon?: string;
    sortOrder?: number;
    isVisible?: boolean;
  }
) {
  if (input.id) {
    const item = await prisma.menuItem.update({
      where: { id: input.id },
      data: {
        parentId: input.parentId,
        label: input.label,
        url: input.url,
        isExternal: input.isExternal,
        openInNewTab: input.openInNewTab,
        icon: input.icon,
        sortOrder: input.sortOrder,
        isVisible: input.isVisible,
      },
    });
    await purgeMenuCache(menuId);
    return item;
  }

  const item = await prisma.menuItem.create({
    data: {
      menuId,
      parentId: input.parentId ?? null,
      label: input.label,
      url: input.url,
      isExternal: input.isExternal ?? false,
      openInNewTab: input.openInNewTab ?? false,
      icon: input.icon ?? null,
      sortOrder: input.sortOrder ?? 0,
      isVisible: input.isVisible ?? true,
    },
  });
  await purgeMenuCache(menuId);
  return item;
}

export async function reorderMenuItems(
  menuId: string,
  items: Array<{ id: string; sortOrder: number; parentId?: string | null }>
) {
  await prisma.$transaction(
    items.map((item) =>
      prisma.menuItem.update({
        where: { id: item.id, menuId },
        data: { sortOrder: item.sortOrder, parentId: item.parentId ?? null },
      })
    )
  );

  await writeAuditLog({
    action: "menu_updated",
    entityType: "menus",
    entityId: menuId,
    payload: { action: "reorder", count: items.length },
  });

  const menu = await prisma.menu.findUniqueOrThrow({
    where: { id: menuId },
    select: { slug: true, locale: true },
  });
  purgeCmsContentCaches({ locales: [menu.locale] });
  return getMenuBySlug(menu.slug, menu.locale);
}

export async function deleteMenuItem(id: string) {
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) return null;

  await prisma.menuItem.delete({ where: { id } });

  await writeAuditLog({
    action: "menu_updated",
    entityType: "menus",
    entityId: item.menuId,
    payload: { action: "delete_item", itemId: id },
  });

  await purgeMenuCache(item.menuId);

  return item;
}

export async function updateMenu(
  id: string,
  data: Prisma.MenuUpdateInput,
  userId?: string
) {
  const menu = await prisma.menu.update({ where: { id }, data });

  await writeAuditLog({
    action: "menu_updated",
    entityType: "menus",
    entityId: menu.id,
    actorUserId: userId ?? null,
    payload: { name: menu.name },
  });

  purgeCmsContentCaches({ locales: [menu.locale] });

  return menu;
}

export async function seedDefaultMenus(locale: ContentLocale = "en") {
  const defaults: Array<{ name: string; slug: string; menuType: MenuType }> = [
    { name: "Header Navigation", slug: "header", menuType: "header" },
    { name: "Footer Navigation", slug: "footer", menuType: "footer" },
    { name: "Quick Links", slug: "quick-links", menuType: "quick_links" },
  ];

  const created = [];
  for (const def of defaults) {
    const existing = await prisma.menu.findFirst({
      where: { slug: def.slug, locale, deletedAt: null },
    });
    if (!existing) {
      created.push(await createMenu({ ...def, locale }));
    }
  }
  return created;
}
