import type { Menu } from "@/components/layout/navbar/types";
import { CTA_PATH, POPULAR_LINKS, flattenSubMenu } from "@/constants/navigation";
import { cmsMenuToNav, isMegaMenuItem } from "@/lib/cms/nav-adapter";
import type { CmsMenu } from "@/lib/cms/types";
import NavBrandBlock from "@/components/layout/navbar/NavBrandBlock";
import { NavShellLink } from "@/components/layout/navbar/NavShellLink";
import { getMenuIcon, NavChevronIcon } from "@/components/layout/navbar/NavMenuIcons";
import NavBarMobileActions from "@/components/layout/navbar/NavBarMobileActions";
import NavBarToolsDeferred from "@/components/nav/NavBarToolsDeferred";
import NavBarScrollEnhance from "@/components/layout/navbar/NavBarScrollEnhance";

type Props = {
  menus: Menu[];
};

function DesktopDropdownPanel({ item, isMega }: { item: Menu; isMega: boolean }) {
  const groups = item.subMenuGroups;
  const flatItems = flattenSubMenu(item);
  if (!flatItems?.length && !groups?.length) return null;

  return (
    <div
      className={`pointer-events-none absolute left-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white/95 opacity-0 shadow-2xl backdrop-blur-xl transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 ${
        isMega && groups?.length
          ? "w-[min(92vw,640px)] p-4"
          : isMega
            ? "w-[min(90vw,520px)] p-4"
            : "w-56 py-2"
      }`}
    >
      {isMega && groups?.length ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {groups.map((group, groupIdx) => (
            <div key={group.label ?? `about-group-${groupIdx}`}>
              {group.label ? (
                <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {group.label}
                </p>
              ) : (
                <div className="mb-2 h-0 sm:h-5" aria-hidden />
              )}
              <ul className="space-y-0.5">
                {group.items.map((subItem) => (
                  <li key={`${group.label ?? "g"}-${subItem.path}`}>
                    <NavShellLink
                      href={subItem.path}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-brand-blue/10 hover:text-brand-blue"
                    >
                      {subItem.title}
                    </NavShellLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : isMega ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Popular
            </p>
            <ul className="mb-3 space-y-0.5">
              {POPULAR_LINKS.map((link) => (
                <li key={link.path}>
                  <NavShellLink
                    href={link.path}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-saffron/20"
                  >
                    {link.title}
                  </NavShellLink>
                </li>
              ))}
            </ul>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Overview
            </p>
            <ul className="space-y-0.5">
              {flatItems?.slice(0, 2).map((subItem) => (
                <li key={subItem.path}>
                  <NavShellLink
                    href={subItem.path}
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-brand-blue/10 hover:text-brand-blue"
                  >
                    {subItem.title}
                  </NavShellLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              More
            </p>
            <ul className="grid gap-0.5">
              {flatItems?.slice(2).map((subItem) => (
                <li key={subItem.path}>
                  <NavShellLink
                    href={subItem.path}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-brand-blue/10 hover:text-brand-blue"
                  >
                    {subItem.title}
                  </NavShellLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <ul>
          {flatItems?.map((subItem) => (
            <li key={subItem.path}>
              <NavShellLink
                href={subItem.path}
                className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-brand-blue/10 hover:text-brand-blue"
              >
                {subItem.title}
              </NavShellLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Server-rendered header — real links in HTML; CSS hover/focus dropdowns. */
export default function NavBarShell({ menus }: Props) {
  const mobileMenus = menus.filter(
    (item) => !(item.path === CTA_PATH && !flattenSubMenu(item)?.length)
  );

  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 min-h-[4.25rem] w-full border-b-2 border-brand-saffron/25 bg-white/90 py-1 shadow-sm backdrop-blur-md transition-all duration-300 motion-reduce:transition-none"
    >
      <NavBarScrollEnhance />
      <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 px-3 py-3 transition-all duration-300 sm:px-4 lg:px-6">
        <NavBrandBlock />

        <nav
          className="hidden min-w-0 flex-1 flex-wrap items-center justify-end gap-x-0.5 gap-y-1 lg:flex xl:gap-x-1.5"
          aria-label="Main navigation"
        >
          {menus.map((item) => {
            const subItems = flattenSubMenu(item);
            const icon = getMenuIcon(item.title);
            const isCta = item.path === CTA_PATH && !subItems?.length;
            const isMega = isMegaMenuItem(item);
            const menuKey = item.title;

            if (isCta) {
              return (
                <NavShellLink
                  key={menuKey}
                  href={item.path}
                  className="ml-1 inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-saffron px-3 py-2 text-xs font-bold text-brand-navy shadow-lg shadow-brand-saffron/25 transition-colors hover:bg-brand-saffron-dark hover:text-white xl:px-4 xl:text-sm"
                >
                  {icon}
                  {item.title}
                </NavShellLink>
              );
            }

            if (subItems?.length) {
              return (
                <div key={menuKey} className="group relative">
                  <button
                    type="button"
                    className="flex cursor-default items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-brand-blue/5 hover:text-brand-blue xl:px-3 xl:py-2 xl:text-sm"
                    aria-haspopup="menu"
                    aria-expanded="false"
                  >
                    {icon}
                    <span>{item.title}</span>
                    <NavChevronIcon className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <DesktopDropdownPanel item={item} isMega={isMega} />
                </div>
              );
            }

            return (
              <NavShellLink
                key={menuKey}
                href={item.path}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-700 transition-all duration-200 hover:bg-brand-blue/5 hover:text-brand-blue xl:px-3 xl:py-2 xl:text-sm"
              >
                {icon}
                {item.title}
              </NavShellLink>
            );
          })}
        </nav>

        <NavBarToolsDeferred visibility="desktop" />

        <div className="flex min-w-[14.5rem] shrink-0 items-center gap-1.5 sm:min-w-[15.5rem] sm:gap-2 lg:hidden">
          <NavBarMobileActions menus={mobileMenus}>
            <NavShellLink
              href={CTA_PATH}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-brand-saffron px-3 py-2.5 text-xs font-bold text-brand-navy shadow-md shadow-brand-saffron/20 sm:px-4 sm:text-sm"
            >
              Register
            </NavShellLink>
          </NavBarMobileActions>
        </div>
      </div>
    </header>
  );
}

export function navMenusFromCms(headerMenu: CmsMenu | null | undefined) {
  return cmsMenuToNav(headerMenu);
}
