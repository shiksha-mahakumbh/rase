export const COOKIE_CONSENT_KEY = "smk_cookie_consent";
export const COOKIE_CONSENT_ACCEPTED = "accepted";
export const COOKIE_CONSENT_ESSENTIAL = "essential";
export const COOKIE_ACCEPTED_EVENT = "smk-cookie-accepted";
export const COOKIE_WITHDRAWN_EVENT = "smk-cookie-withdrawn";

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === COOKIE_CONSENT_ACCEPTED;
}

export function getCookieConsent(): "accepted" | "essential" | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === COOKIE_CONSENT_ACCEPTED || value === COOKIE_CONSENT_ESSENTIAL) {
    return value;
  }
  return null;
}

export function setAnalyticsConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    COOKIE_CONSENT_KEY,
    accepted ? COOKIE_CONSENT_ACCEPTED : COOKIE_CONSENT_ESSENTIAL
  );
  window.dispatchEvent(new Event(accepted ? COOKIE_ACCEPTED_EVENT : COOKIE_WITHDRAWN_EVENT));
}

export function openGraphLocale(appLocale: string): "en_IN" | "hi_IN" {
  return appLocale === "hi" ? "hi_IN" : "en_IN";
}
