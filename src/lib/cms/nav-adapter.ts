import type { Menu } from "@/components/layout/navbar/types";
import { NAV_MENUS } from "@/constants/navigation";
import type { CmsMenu } from "./types";

export function cmsMenuToNav(menu: CmsMenu | null | undefined): Menu[] {
  if (!menu?.items?.length) return NAV_MENUS;

  return menu.items.map((item) => ({
    path: item.url,
    title: item.label,
    subMenu: item.children?.length
      ? item.children.map((c) => ({ path: c.url, title: c.label }))
      : undefined,
  }));
}
