export type ActiveLocale = "en" | "hi";

/** Map between English routes and static /hi/* routes (no next-intl client). */
export function resolveLocalePaths(pathname: string): {
  current: ActiveLocale;
  enHref: string;
  hiHref: string;
} {
  const normalized = pathname.split("?")[0]?.split("#")[0] || "/";

  if (normalized === "/hi" || normalized.startsWith("/hi/")) {
    const enPath = normalized === "/hi" ? "/" : normalized.slice(3) || "/";
    return { current: "hi", enHref: enPath, hiHref: normalized };
  }

  const hiPath = normalized === "/" ? "/hi" : `/hi${normalized}`;
  return { current: "en", enHref: normalized, hiHref: hiPath };
}
