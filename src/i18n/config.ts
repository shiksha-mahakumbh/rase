/**
 * i18n architecture (Phase 2) — translations in Phase 4
 * Planned: next-intl with [locale] segment
 */

export const locales = ["en", "hi", "fr", "es", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  fr: "Français",
  es: "Español",
  ar: "العربية",
};

/** RTL locales */
export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: Locale) {
  return rtlLocales.includes(locale);
}

/**
 * Future route strategy:
 * - localePrefix: 'as-needed' (default en at /)
 * - /hi/registration, /fr/registration, etc.
 */
export const localePrefix = "as-needed" as const;
