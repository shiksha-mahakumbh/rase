const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

/** Allow only absolute http(s) URLs for user-facing external links. */
export function sanitizeExternalUrl(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  try {
    const url = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.has(url.protocol)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}
