"use client";

import { useEffect } from "react";

/** Deferred scroll styling for the server-rendered header shell. */
export default function NavBarScrollEnhance() {
  useEffect(() => {
    const header = document.getElementById("site-header");
    const inner = header?.querySelector<HTMLElement>(":scope > .mx-auto.flex");
    if (!header || !inner) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 16;
      header.classList.toggle("border-brand-saffron/40", scrolled);
      header.classList.toggle("bg-white/95", scrolled);
      header.classList.toggle("py-0", scrolled);
      header.classList.toggle("shadow-[0_8px_32px_rgba(255,153,51,0.12)]", scrolled);
      header.classList.toggle("backdrop-blur-xl", scrolled);
      header.classList.toggle("border-brand-saffron/25", !scrolled);
      header.classList.toggle("bg-white/90", !scrolled);
      header.classList.toggle("py-1", !scrolled);
      header.classList.toggle("shadow-sm", !scrolled);
      header.classList.toggle("backdrop-blur-md", !scrolled);
      inner.classList.toggle("py-2", scrolled);
      inner.classList.toggle("py-3", !scrolled);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
