"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Menu } from "./navbar/types";
import { getMenuIcon, NavChevronIcon } from "./navbar/NavMenuIcons";
import {
  NAV_MENUS,
  POPULAR_LINKS,
  CTA_PATH,
  MEGA_MENU_INDEX,
} from "@/constants/navigation";
import NavBarTools from "@/components/nav/NavBarTools";
import { useCms } from "@/lib/cms/context";
import { cmsMenuToNav } from "@/lib/cms/nav-adapter";

function isExternalPath(path: string): boolean {
  return path.startsWith("http://") || path.startsWith("https://");
}

interface NavLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  className,
  children,
  onClick,
}) => {
  if (isExternalPath(href)) {
    return (
      <a
        href={href}
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
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

function DesktopDropdown({
  item,
  idx,
  isMega,
  isOpen,
  onClose,
}: {
  item: Menu;
  idx: number;
  isMega: boolean;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !item.subMenu) return null;

  return (
    <div
      className={`absolute left-0 z-30 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white/95 opacity-100 shadow-2xl backdrop-blur-xl transition-opacity duration-200 ${
        isMega ? "w-[min(90vw,520px)] p-4" : "w-56 py-2"
      }`}
      role="menu"
    >
      {isMega ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Popular
            </p>
            <ul className="mb-3 space-y-0.5">
              {POPULAR_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink
                    href={link.path}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-navy transition hover:bg-brand-saffron/20"
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Overview
            </p>
            <ul className="space-y-0.5">
              {item.subMenu.slice(0, 2).map((subItem, subIdx) => (
                <li key={subIdx}>
                  <NavLink
                    href={subItem.path}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-brand-blue/10 hover:text-brand-blue"
                  >
                    {subItem.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              विभाग
            </p>
            <ul className="grid gap-0.5">
              {item.subMenu.slice(2).map((subItem, subIdx) => (
                <li key={subIdx}>
                  <NavLink
                    href={subItem.path}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-brand-blue/10 hover:text-brand-blue"
                  >
                    {subItem.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <ul>
          {item.subMenu.map((subItem, subIdx) => (
            <li key={subIdx}>
              <NavLink
                href={subItem.path}
                onClick={onClose}
                className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-brand-blue/10 hover:text-brand-blue"
              >
                {subItem.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const cms = useCms();
  const [fetchedMenu, setFetchedMenu] = useState<Menu[] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const menus = cms?.headerMenu
    ? cmsMenuToNav(cms.headerMenu)
    : fetchedMenu ?? NAV_MENUS;

  useEffect(() => {
    if (cms?.headerMenu) return;
    fetch("/api/v2/menus?type=header")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.menu) setFetchedMenu(cmsMenuToNav(d.menu));
      })
      .catch(() => undefined);
  }, [cms?.headerMenu]);

  const handleSubMenuToggle = (index: number) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenSubMenuIndex(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isActive = (path: string, subMenu?: Menu[]): boolean => {
    if (path !== "/" && pathname === path) return true;
    if (pathname === "/" && path === "/") return true;
    if (subMenu) {
      return subMenu.some(
        (sub) =>
          pathname === sub.path ||
          (sub.path !== "/" &&
            !isExternalPath(sub.path) &&
            pathname.startsWith(sub.path))
      );
    }
    return false;
  };

  const closeMobile = () => setIsMenuOpen(false);
  const closeDropdown = () => setOpenSubMenuIndex(null);

  return (
    <header
      ref={menuRef}
      className={`sticky top-0 z-50 w-full border-b-2 transition-all duration-300 motion-reduce:transition-none ${
        scrolled
          ? "border-brand-saffron/40 bg-white/95 py-0 shadow-[0_8px_32px_rgba(255,153,51,0.12)] backdrop-blur-xl"
          : "border-brand-saffron/25 bg-white/90 py-1 shadow-sm backdrop-blur-md"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 px-3 transition-all duration-300 sm:px-4 lg:px-6 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-2 sm:gap-3"
          aria-label="Shiksha Mahakumbh Abhiyan Home"
        >
          <div
            className={`relative overflow-hidden rounded-xl border-2 border-brand-saffron/30 bg-white shadow-sm transition-all duration-300 group-hover:border-brand-saffron/60 group-hover:shadow-md ${
              scrolled ? "h-10 w-10" : "h-11 w-11"
            }`}
          >
            <Image
              src="/branding/shiksha-mahakumbh-brand-hero.png"
              alt="Shiksha Mahakumbh"
              width={44}
              height={44}
              className="h-full w-full object-cover object-left-top"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Department of Holistic Education
            </p>
            <p
              className={`font-extrabold leading-tight transition-all ${
                scrolled ? "text-base" : "text-lg"
              }`}
            >
              <span className="text-brand-blue">Shiksha </span>
              <span className="text-brand-saffron">Mahakumbh</span>
            </p>
          </div>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 flex-wrap items-center justify-end gap-x-0.5 gap-y-1 lg:flex xl:gap-x-1.5"
          aria-label="Main navigation"
        >
          {menus.map((item, idx) => {
            const active = isActive(item.path, item.subMenu);
            const icon = getMenuIcon(item.title);
            const isCta = item.path === CTA_PATH && !item.subMenu;
            const isMega = idx === MEGA_MENU_INDEX && !!item.subMenu;

            if (isCta) {
              return (
                <NavLink
                  key={idx}
                  href={item.path}
                  className="ml-1 inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-saffron px-3 py-2 text-xs font-bold text-brand-navy shadow-lg shadow-brand-saffron/25 transition-all hover:-translate-y-0.5 hover:bg-brand-saffron-dark hover:text-white xl:px-4 xl:text-sm"
                >
                  {icon}
                  {item.title}
                </NavLink>
              );
            }

            if (item.subMenu) {
              return (
                <div key={idx} className="relative">
                  <button
                    type="button"
                    onClick={() => handleSubMenuToggle(idx)}
                    aria-expanded={openSubMenuIndex === idx}
                    aria-haspopup="true"
                    className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all duration-200 xl:px-3 xl:py-2 xl:text-sm ${
                      active
                        ? "bg-brand-saffron/15 text-brand-saffron-dark"
                        : "text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue"
                    }`}
                  >
                    {icon}
                    <span>{item.title}</span>
                    <NavChevronIcon
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        openSubMenuIndex === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <DesktopDropdown
                    item={item}
                    idx={idx}
                    isMega={isMega}
                    isOpen={openSubMenuIndex === idx}
                    onClose={closeDropdown}
                  />
                </div>
              );
            }

            return (
              <NavLink
                key={idx}
                href={item.path}
                className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all duration-200 xl:px-3 xl:py-2 xl:text-sm ${
                  active
                    ? "bg-brand-saffron/15 text-brand-saffron-dark"
                    : "text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue"
                }`}
              >
                {icon}
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        <NavBarTools />

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
          <div className="hidden min-[380px]:block sm:block">
            <NavBarTools />
          </div>
          <NavLink
            href={CTA_PATH}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-brand-saffron px-3 py-2.5 text-xs font-bold text-brand-navy shadow-md shadow-brand-saffron/20 sm:px-4 sm:text-sm"
          >
            Register
          </NavLink>
          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-brand-saffron/30 bg-white text-brand-navy shadow-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <div
              className={`flex w-5 flex-col items-center justify-center gap-1.5 transition-transform duration-200 ${
                isMenuOpen ? "gap-0" : ""
              }`}
            >
              <span
                className={`block h-0.5 w-5 rounded-full bg-brand-navy transition-all duration-200 ${
                  isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 rounded-full bg-brand-navy transition-all duration-200 ${
                  isMenuOpen ? "w-0 opacity-0" : "w-3.5 opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-brand-navy transition-all duration-200 ${
                  isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 top-[60px] z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden"
            onClick={closeMobile}
            aria-label="Close menu overlay"
          />
          <div className="fixed right-0 top-[60px] z-50 flex h-[calc(100vh-60px)] w-[min(100%,320px)] flex-col overflow-y-auto border-l border-gray-200 bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden">
            <div className="space-y-3 border-b border-gray-100 p-4">
              <div className="flex justify-center">
                <NavBarTools />
              </div>
              <NavLink
                href={CTA_PATH}
                onClick={closeMobile}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-saffron py-3 text-sm font-bold text-brand-navy shadow-lg shadow-brand-saffron/25"
              >
                Participate — Registration
              </NavLink>
            </div>
            <ul className="flex flex-col p-4 font-medium">
              {menus.map((item, idx) => (
                <li key={idx} className="border-b border-gray-50 last:border-0">
                  {item.subMenu ? (
                    <details className="group py-2">
                      <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-brand-navy [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center gap-2 font-semibold">
                          {getMenuIcon(item.title)}
                          {item.title}
                        </span>
                        <NavChevronIcon className="h-4 w-4 transition group-open:rotate-180" />
                      </summary>
                      <ul className="mb-2 space-y-1 border-l-2 border-brand-saffron/30 pl-4">
                        {item.subMenu.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <NavLink
                              href={subItem.path}
                              onClick={closeMobile}
                              className="block rounded-lg py-2 text-sm text-gray-600 hover:text-brand-blue"
                            >
                              {subItem.title}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : item.path === CTA_PATH ? (
                    <NavLink
                      href={item.path}
                      onClick={closeMobile}
                      className="flex items-center gap-2 py-3 font-semibold text-brand-saffron-dark"
                    >
                      {getMenuIcon(item.title)}
                      {item.title}
                    </NavLink>
                  ) : (
                    <NavLink
                      href={item.path}
                      onClick={closeMobile}
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
              ))}
            </ul>
          </div>
        </>
      )}
    </header>
  );
};

export default NavBar;
