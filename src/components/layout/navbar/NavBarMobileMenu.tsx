"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { Menu } from "@/components/layout/navbar/types";
import { getMenuIcon, NavChevronIcon } from "@/components/layout/navbar/NavMenuIcons";
import { CTA_PATH, MOBILE_QUICK_LINKS, flattenSubMenu } from "@/constants/navigation";
import { resolveNavHref } from "@/lib/security/safe-nav-url";

const GlobalSearch = dynamic(() => import("@/components/search/GlobalSearch"), {
  ssr: false,
  loading: () => (
    <div className="h-11 w-full rounded-lg bg-slate-100" aria-hidden="true" />
  ),
});

type NavLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

function NavLink({ href, className, children, onClick }: NavLinkProps) {
  const nav = resolveNavHref(href, "/");

  if (nav.external) {
    return (
      <a
        href={nav.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={nav.href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

type Props = {
  menus: Menu[];
};

export default function NavBarMobileMenu({ menus }: Props) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [headerOffset, setHeaderOffset] = useState("4rem");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  const isActive = (path: string, subMenu?: Menu[]) => {
    if (path !== "/" && pathname === path) return true;
    if (pathname === "/" && path === "/") return true;
    if (subMenu) {
      return subMenu.some((sub) => {
        const nav = resolveNavHref(sub.path);
        if (nav.external) return false;
        return pathname === nav.href || (nav.href !== "/" && pathname.startsWith(nav.href));
      });
    }
    return false;
  };

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;

    const syncOffset = () => {
      const height = `${header.getBoundingClientRect().height}px`;
      setHeaderOffset(height);
      document.documentElement.style.setProperty("--nav-offset", height);
      document.documentElement.style.setProperty("--site-header-height", height);
    };

    syncOffset();
    const observer = new ResizeObserver(syncOffset);
    observer.observe(header);
    window.addEventListener("resize", syncOffset, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncOffset);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!isOpen) {
      menuButtonRef.current?.focus();
      return;
    }

    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    requestAnimationFrame(() => first?.focus());

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !focusable?.length) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  return (
    <>
      <button
        ref={menuButtonRef}
        type="button"
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-saffron/30 bg-white text-brand-navy shadow-sm"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
      >
        <div
          className={`flex w-5 flex-col items-center justify-center gap-1.5 transition-transform duration-200 ${
            isOpen ? "gap-0" : ""
          }`}
        >
          <span
            className={`block h-0.5 w-5 rounded-full bg-brand-navy transition-all duration-200 ${
              isOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 rounded-full bg-brand-navy transition-all duration-200 ${
              isOpen ? "w-0 opacity-0" : "w-3.5 opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-brand-navy transition-all duration-200 ${
              isOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-x-0 bottom-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            style={{ top: headerOffset }}
            onClick={close}
            aria-label="Close menu overlay"
          />
          <div
            ref={drawerRef}
            id="mobile-nav-drawer"
            tabIndex={-1}
            className="fixed right-0 z-50 flex w-[min(100%,320px)] flex-col overflow-y-auto border-l border-gray-200 bg-white/95 shadow-2xl backdrop-blur-xl lg:hidden"
            style={{
              top: headerOffset,
              height: `calc(100dvh - ${headerOffset})`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="space-y-3 border-b border-gray-100 p-4">
              <NavLink
                href={CTA_PATH}
                onClick={close}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-saffron py-3 text-sm font-bold text-brand-navy shadow-lg shadow-brand-saffron/25"
              >
                Participate — Registration
              </NavLink>
              {isOpen ? (
                <div className="w-full">
                  <GlobalSearch compact />
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-2">
                {MOBILE_QUICK_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    href={link.path}
                    onClick={close}
                    className="flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-brand-navy"
                  >
                    {link.title}
                  </NavLink>
                ))}
              </div>
            </div>
            <ul className="flex flex-col p-4 font-medium">
              {menus.map((item) => {
                const subItems = flattenSubMenu(item);
                return (
                  <li key={item.title} className="border-b border-gray-50 last:border-0">
                    {subItems?.length ? (
                      <details className="group py-2">
                        <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-brand-navy [&::-webkit-details-marker]:hidden">
                          <span className="flex items-center gap-2 font-semibold">
                            {getMenuIcon(item.title)}
                            {item.title}
                          </span>
                          <NavChevronIcon className="h-4 w-4 transition group-open:rotate-180" />
                        </summary>
                        {item.subMenuGroups?.length ? (
                          <div className="mb-2 space-y-3 border-l-2 border-brand-saffron/30 pl-4">
                            {item.subMenuGroups.map((group, groupIdx) => (
                              <div key={group.label ?? `about-group-${groupIdx}`}>
                                {group.label ? (
                                  <p className="py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {group.label}
                                  </p>
                                ) : null}
                                <ul className="space-y-1">
                                  {group.items.map((subItem) => (
                                    <li key={subItem.path}>
                                      <NavLink
                                        href={subItem.path}
                                        onClick={close}
                                        className="block rounded-lg py-2 text-sm text-gray-600 hover:text-brand-blue"
                                      >
                                        {subItem.title}
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <ul className="mb-2 space-y-1 border-l-2 border-brand-saffron/30 pl-4">
                            {subItems.map((subItem) => (
                              <li key={subItem.path}>
                                <NavLink
                                  href={subItem.path}
                                  onClick={close}
                                  className="block rounded-lg py-2 text-sm text-gray-600 hover:text-brand-blue"
                                >
                                  {subItem.title}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </details>
                    ) : (
                      <NavLink
                        href={item.path}
                        onClick={close}
                        className={`flex items-center gap-2 py-3 transition ${
                          isActive(item.path)
                            ? "font-semibold text-brand-blue"
                            : "text-gray-700 hover:text-brand-blue"
                        }`}
                      >
                        {getMenuIcon(item.title)}
                        {item.title}
                      </NavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : null}
    </>
  );
}
