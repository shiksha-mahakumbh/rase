"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, type Locale } from "@/i18n/config";

/** Phase S: English and Hindi only; other locales reserved for future expansion */
const ACTIVE_LOCALES: Locale[] = ["en", "hi"];

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const current = ACTIVE_LOCALES.includes(locale) ? locale : "en";

  return (
    <label className="flex min-h-11 items-center gap-2 text-sm">
      <span className="sr-only">Select language</span>
      <select
        value={current}
        onChange={(e) => {
          router.replace(pathname, { locale: e.target.value as Locale });
        }}
        className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-brand-navy"
        aria-label="Language"
      >
        {ACTIVE_LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {localeLabels[loc]}
          </option>
        ))}
      </select>
    </label>
  );
}
