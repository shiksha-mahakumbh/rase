"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import type { Menu } from "@/components/layout/navbar/types";
import { scheduleAfterLcp } from "@/lib/perf/schedule-after-lcp";

const NavBarTools = dynamic(() => import("@/components/nav/NavBarTools"), { ssr: false });
const NavBarMobileMenu = dynamic(() => import("@/components/layout/navbar/NavBarMobileMenu"), {
  ssr: false,
});

function MobileToolsPlaceholder() {
  return (
    <div className="flex items-center gap-2 lg:hidden" aria-hidden="true">
      <div className="h-11 min-w-[7.5rem] rounded-lg border border-slate-200 bg-white" />
    </div>
  );
}

function HamburgerPlaceholder() {
  return (
    <div
      className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-saffron/30 bg-white text-brand-navy shadow-sm"
      aria-hidden="true"
    >
      <div className="flex w-5 flex-col items-center justify-center gap-1.5">
        <span className="block h-0.5 w-5 rounded-full bg-brand-navy/40" />
        <span className="block h-0.5 w-3.5 rounded-full bg-brand-navy/40" />
        <span className="block h-0.5 w-5 rounded-full bg-brand-navy/40" />
      </div>
    </div>
  );
}

/** Single post-LCP hydration for mobile language tools + drawer menu. */
export default function NavBarMobileActions({
  menus,
  children,
}: {
  menus: Menu[];
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return scheduleAfterLcp(() => setReady(true), { bufferMs: 400, fallbackMs: 9000 });
  }, []);

  if (!ready) {
    return (
      <>
        <MobileToolsPlaceholder />
        {children}
        <HamburgerPlaceholder />
      </>
    );
  }

  return (
    <>
      <NavBarTools visibility="mobile" />
      {children}
      <NavBarMobileMenu menus={menus} />
    </>
  );
}
