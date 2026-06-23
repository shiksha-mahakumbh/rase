import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";

/** Relative app paths only (must start with `/`, not `//`). */
export function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export type ResolvedNavHref = {
  href: string;
  external: boolean;
};

/** Resolve CMS/admin URLs to a safe internal path or external https link. */
export function resolveNavHref(
  raw: string | undefined | null,
  fallback = "/"
): ResolvedNavHref {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return { href: fallback, external: false };
  }
  if (isInternalPath(trimmed)) {
    return { href: trimmed, external: false };
  }
  const safe = sanitizeExternalUrl(trimmed);
  if (safe) {
    return { href: safe, external: true };
  }
  return { href: fallback, external: false };
}
