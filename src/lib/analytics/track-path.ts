/** Paths excluded from public visitor analytics (admin noise, internal data). */
const EXCLUDED_PREFIXES = ["/admin", "/api/"];

const EXCLUDED_SEGMENTS = ["datadekh", "noticeboarddata", "DelegateForm"];

export function shouldTrackAnalytics(pathname: string | null | undefined): boolean {
  if (!pathname) return false;

  const path = pathname.toLowerCase();

  if (EXCLUDED_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix))) {
    return false;
  }

  if (EXCLUDED_SEGMENTS.some((segment) => path.includes(segment))) {
    return false;
  }

  return true;
}
