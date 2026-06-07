"use client";

import { localeLabels, locales } from "@/i18n/config";

/** Phase 4: wire to next-intl router */
export default function LanguageSwitcherPlaceholder() {
  return (
    <div className="relative">
      <button
        type="button"
        disabled
        title="Multilingual support coming soon"
        className="flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-500"
        aria-label="Language selection (coming soon)"
      >
        <span aria-hidden>🌐</span>
        <span className="hidden sm:inline">{localeLabels.en}</span>
        <span className="text-[10px]">▾</span>
      </button>
      <span className="sr-only">
        Planned languages: {locales.join(", ")}
      </span>
    </div>
  );
}
