/** @deprecated Use POST /api/admin/session — client must not set session cookies. */
export const ADMIN_SESSION_COOKIE = "smk_admin_session";

/** @deprecated Server sets HttpOnly signed cookie via /api/admin/session */
export function setAdminSessionCookie() {
  // No-op: session cookie is set server-side after Supabase auth verification.
}

/** @deprecated Cleared via DELETE /api/admin/session */
export function clearAdminSessionCookie() {
  // No-op: logout calls DELETE /api/admin/session
}
