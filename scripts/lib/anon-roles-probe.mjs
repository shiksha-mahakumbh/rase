/**
 * Probe whether the Supabase anon key can read the roles table via PostgREST.
 * Returns true when access is blocked (no rows leaked).
 */
export function isAnonRolesAccessBlocked(responseStatus, responseText) {
  if (
    responseStatus === 401 ||
    responseStatus === 403 ||
    /permission denied|row-level security|JWT/i.test(responseText)
  ) {
    return true;
  }

  try {
    const parsed = JSON.parse(responseText);
    if (Array.isArray(parsed)) {
      return parsed.length === 0;
    }
    if (parsed && typeof parsed === "object" && "code" in parsed) {
      return true;
    }
  } catch {
    /* non-JSON */
  }

  return false;
}
