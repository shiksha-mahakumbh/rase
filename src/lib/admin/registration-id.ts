import { REGISTRATION_ID_PREFIX } from "@/types/registration";

export const ADMIN_REGISTRATION_PUBLIC_ID_RE = new RegExp(
  `^${REGISTRATION_ID_PREFIX}-\\d{6}$`
);

export const ADMIN_REGISTRATION_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Public SMK ID or internal UUID — used by admin registration detail routes. */
export function isAdminRegistrationIdentifier(value: string): boolean {
  const id = value.trim();
  return ADMIN_REGISTRATION_PUBLIC_ID_RE.test(id) || ADMIN_REGISTRATION_UUID_RE.test(id);
}
