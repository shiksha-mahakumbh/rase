import type { Menu } from "@/components/layout/navbar/types";
import {
  NAV_MENUS,
  PARTICIPATE_NAV_ITEMS,
  flattenSubMenu,
} from "@/constants/navigation";
import type { CmsMenu } from "./types";

function cmsItemsToMenus(menu: CmsMenu): Menu[] {
  return menu.items.map((item) => ({
    path: item.url,
    title: item.label,
    subMenu: item.children?.length
      ? item.children.map((c) => ({ path: c.url, title: c.label }))
      : undefined,
  }));
}

/** Ensure Donation exists as a top-level nav item when CMS menus omit it. */
function mergeTopLevelParticipateItems(menus: Menu[]): Menu[] {
  const withoutParticipateDropdown = menus.filter((item) => item.title !== "Participate");

  const topLevelPaths = new Set(
    withoutParticipateDropdown
      .filter((item) => !item.subMenu && !item.subMenuGroups)
      .map((item) => item.path)
  );

  const missing = PARTICIPATE_NAV_ITEMS.filter((item) => !topLevelPaths.has(item.path));
  if (!missing.length) return withoutParticipateDropdown;

  const committeeIndex = withoutParticipateDropdown.findIndex((item) => item.title === "Committee");
  if (committeeIndex >= 0) {
    return [
      ...withoutParticipateDropdown.slice(0, committeeIndex),
      ...missing,
      ...withoutParticipateDropdown.slice(committeeIndex),
    ];
  }

  return [...withoutParticipateDropdown, ...missing];
}

function collectKnownPaths(menus: Menu[]): Set<string> {
  const paths = new Set<string>();
  for (const item of menus) {
    paths.add(item.path);
    for (const sub of flattenSubMenu(item) ?? []) {
      paths.add(sub.path);
    }
  }
  return paths;
}

/**
 * CMS header items extend/override defaults — never replace the full nav tree.
 * Matches footer quick-link merge behaviour.
 */
export function mergeHeaderNavMenus(defaults: Menu[], cmsItems: Menu[]): Menu[] {
  if (!cmsItems.length) return mergeTopLevelParticipateItems(defaults);

  const cmsByTitle = new Map(cmsItems.map((m) => [m.title.trim().toLowerCase(), m]));

  const merged = defaults.map((item) => {
    const cms = cmsByTitle.get(item.title.trim().toLowerCase());
    if (!cms) return item;
    return {
      ...item,
      path: cms.path || item.path,
      title: cms.title || item.title,
      subMenu: cms.subMenu?.length ? cms.subMenu : item.subMenu,
      subMenuGroups: cms.subMenuGroups?.length ? cms.subMenuGroups : item.subMenuGroups,
    };
  });

  const knownTitles = new Set(defaults.map((d) => d.title.trim().toLowerCase()));
  const knownPaths = collectKnownPaths(defaults);

  const extras = cmsItems.filter(
    (c) =>
      !c.subMenu?.length &&
      !knownTitles.has(c.title.trim().toLowerCase()) &&
      !knownPaths.has(c.path)
  );

  if (extras.length) {
    const regIdx = merged.findIndex((m) => m.title === "Registration");
    const insertAt = regIdx >= 0 ? regIdx + 1 : merged.length;
    merged.splice(insertAt, 0, ...extras);
  }

  return mergeTopLevelParticipateItems(merged);
}

export function cmsMenuToNav(menu: CmsMenu | null | undefined): Menu[] {
  if (!menu?.items?.length) return NAV_MENUS;
  return mergeHeaderNavMenus(NAV_MENUS, cmsItemsToMenus(menu));
}

/** About uses grouped mega layout; Research uses popular-links mega panel. */
export function isMegaMenuItem(item: Menu): boolean {
  if (item.title === "About" && (item.subMenuGroups?.length || item.subMenu?.length)) {
    return true;
  }
  if (item.title === "Research" && item.subMenu?.length) {
    return true;
  }
  return false;
}
