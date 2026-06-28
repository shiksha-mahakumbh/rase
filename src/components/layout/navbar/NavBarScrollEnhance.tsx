"use client";

import { useEffect } from "react";
import { scheduleAfterLcp } from "@/lib/perf/schedule-after-lcp";

/** Deferred scroll styling for the server-rendered header shell. */
export default function NavBarScrollEnhance() {
  useEffect(() => {
    let cleanupScroll: (() => void) | undefined;

    const cancelLcp = scheduleAfterLcp(
      () => {
        const header = document.getElementById("site-header");
        if (!header) return;

        const onScroll = () => {
          const scrolled = window.scrollY > 16;
          header.classList.toggle("border-brand-saffron/40", scrolled);
          header.classList.toggle("bg-white/95", scrolled);
          header.classList.toggle("shadow-[0_8px_32px_rgba(255,153,51,0.12)]", scrolled);
          header.classList.toggle("backdrop-blur-xl", scrolled);
          header.classList.toggle("border-brand-saffron/25", !scrolled);
          header.classList.toggle("bg-white/90", !scrolled);
          header.classList.toggle("shadow-sm", !scrolled);
          header.classList.toggle("backdrop-blur-md", !scrolled);

          const height = `${header.getBoundingClientRect().height}px`;
          document.documentElement.style.setProperty("--nav-offset", height);
          document.documentElement.style.setProperty("--site-header-height", height);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanupScroll = () => window.removeEventListener("scroll", onScroll);
      },
      { bufferMs: 200, fallbackMs: 8000 }
    );

    return () => {
      cancelLcp();
      cleanupScroll?.();
    };
  }, []);

  return null;
}
