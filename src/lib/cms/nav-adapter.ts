import type { Menu } from "@/components/layout/navbar/types";
import { NAV_MENUS, PARTICIPATE_NAV_ITEMS } from "@/constants/navigation";
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

/** Ensure Brochures, Speakers, Donation, Best Wishes exist as top-level nav items. */
function mergeTopLevelParticipateItems(menus: Menu[]): Menu[] {
  const withoutParticipateDropdown = menus.filter((item) => item.title !== "Participate");

  const topLevelPaths = new Set(
    withoutParticipateDropdown.filter((item) => !item.subMenu).map((item) => item.path)
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

export function cmsMenuToNav(menu: CmsMenu | null | undefined): Menu[] {
  if (!menu?.items?.length) return NAV_MENUS;
  return mergeTopLevelParticipateItems(cmsItemsToMenus(menu));
}
