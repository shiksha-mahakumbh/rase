"use client";

import { ExternalLinkIcon } from "@/components/icons/home";
import { GlobeEducationIcon } from "@/components/icons/home";
import {
  PARTNER_TAB_ACCENT_STYLES,
  type PartnerShowcaseEntry,
  type PartnerShowcaseTabMeta,
} from "@/lib/cms/partner-showcase";
import { canonicalizeAffiliationName } from "@/lib/cms/affiliation-canonical";
import type { TierGroup } from "@/lib/cms/affiliation-tier";

type ChipProps = {
  entry: PartnerShowcaseEntry;
  tab: PartnerShowcaseTabMeta;
};

export function AffiliationChip({ entry, tab }: ChipProps) {
  const styles = PARTNER_TAB_ACCENT_STYLES[tab.accent];
  const base =
    "inline-flex max-w-full items-center gap-1 rounded-md border border-slate-200/90 bg-white/95 px-2 py-1 text-[11px] font-medium leading-tight text-slate-800 shadow-sm transition hover:border-primary/35 hover:bg-primary/5 sm:text-xs sm:px-2.5 sm:py-1.5";

  if (entry.website) {
    return (
      <a
        href={entry.website}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${styles.text} hover:text-primary`}
        title={`${entry.name} — official website`}
        aria-label={`${entry.name}, opens website in new tab`}
      >
        <span className="truncate">{entry.name}</span>
        <ExternalLinkIcon className="h-3 w-3 shrink-0 text-brand-saffron/80" />
      </a>
    );
  }

  return (
    <span className={`${base} ${styles.text}`} title={entry.name}>
      <span className="truncate">{entry.name}</span>
    </span>
  );
}

export function TierSection({
  group,
  tab,
}: {
  group: TierGroup;
  tab: PartnerShowcaseTabMeta;
}) {
  const styles = PARTNER_TAB_ACCENT_STYLES[tab.accent];

  return (
    <section aria-labelledby={`tier-${group.id}`} className="mb-4 last:mb-0">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h4
          id={`tier-${group.id}`}
          className={`text-xs font-bold uppercase tracking-wide ${styles.text}`}
        >
          {group.labelEn}
        </h4>
        <span className="text-[10px] text-slate-400" lang="hi">
          {group.labelHi}
        </span>
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
          {group.entries.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {group.entries.map((entry) => (
          <AffiliationChip
            key={canonicalizeAffiliationName(entry.name).dedupeKey}
            entry={entry}
            tab={tab}
          />
        ))}
      </div>
    </section>
  );
}

export function GlobalReachBanner({ total, linked }: { total: number; linked: number }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-saffron/25 bg-white/90 px-3 py-1.5 text-xs font-medium text-brand-navy shadow-sm">
        <GlobeEducationIcon className="h-4 w-4 text-brand-saffron" />
        <span>
          <strong>{total}+</strong> affiliations · SMK 1.0–6.0
        </span>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-[11px] text-slate-600">
        <span lang="hi">भारतव्यापी</span>
        <span aria-hidden>·</span>
        <span>{linked} linked websites</span>
      </div>
    </div>
  );
}
