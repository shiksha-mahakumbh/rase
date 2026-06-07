"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";

export default function StickyRegisterBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md md:hidden"
      role="region"
      aria-label="Quick registration"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <p className="flex-1 text-xs font-semibold text-brand-navy">
          SMK 6.0 · 9–11 Oct 2026
        </p>
        <Link
          href={ROUTES.registration}
          className="min-h-[44px] shrink-0 rounded-xl bg-brand-saffron px-4 py-2.5 text-sm font-bold text-brand-navy"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
