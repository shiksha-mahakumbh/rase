"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Menu } from "@/components/layout/navbar/types";
import { scheduleAfterLcp } from "@/lib/perf/schedule-after-lcp";

const NavBarMobileMenu = dynamic(() => import("@/components/layout/navbar/NavBarMobileMenu"), {
  ssr: false,
});

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

/** Mobile drawer — staggered later than search to spread main-thread work. */
export default function NavBarMobileMenuDeferred({ menus }: { menus: Menu[] }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return scheduleAfterLcp(() => setReady(true), { bufferMs: 1600, fallbackMs: 11000 });
  }, []);

  if (!ready) {
    return <HamburgerPlaceholder />;
  }

  return <NavBarMobileMenu menus={menus} />;
}
