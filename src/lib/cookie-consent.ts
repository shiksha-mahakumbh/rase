export const COOKIE_CONSENT_KEY = "smk_cookie_consent";
export const COOKIE_CONSENT_ACCEPTED = "accepted";
export const COOKIE_CONSENT_ESSENTIAL = "essential";
export const COOKIE_ACCEPTED_EVENT = "smk-cookie-accepted";

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === COOKIE_CONSENT_ACCEPTED;
}

export function openGraphLocale(appLocale: string): "en_IN" | "hi_IN" {
  return appLocale === "hi" ? "hi_IN" : "en_IN";
}
