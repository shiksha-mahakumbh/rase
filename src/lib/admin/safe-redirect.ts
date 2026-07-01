/** Reject open redirects and path traversal in post-login ?next= targets. */
export function isSafeAdminRedirectPath(raw: string): boolean {
  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\") || path.includes("://")) {
    return false;
  }

  const pathname = path.split(/[?#]/)[0];
  if (!pathname || pathname.includes("..")) return false;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  if (pathname === "/event/checkin" || pathname.startsWith("/event/checkin/")) return true;

  return false;
}
