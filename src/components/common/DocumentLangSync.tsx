"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function langFromPath(pathname: string): string {
  if (pathname === "/hi" || pathname.startsWith("/hi/")) return "hi-IN";
  const match = pathname.match(/^\/(fr|es|ar)(\/|$)/);
  if (match) return `${match[1]}-IN`;
  return "en-IN";
}

/** Keeps `<html lang>` accurate on locale routes without forcing dynamic root layout. */
export default function DocumentLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = langFromPath(pathname);
  }, [pathname]);

  return null;
}
