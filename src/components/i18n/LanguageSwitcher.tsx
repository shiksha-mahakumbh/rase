"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, locales, type Locale } from "@/i18n/config";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">Select language</span>
      <select
        value={locale}
        onChange={(e) => {
          router.replace(pathname, { locale: e.target.value as Locale });
        }}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium text-brand-navy"
        aria-label="Language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeLabels[loc]}
          </option>
        ))}
      </select>
    </label>
  );
}
