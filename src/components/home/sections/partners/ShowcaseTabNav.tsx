"use client";

import {
  PARTNER_SHOWCASE_TABS,
  type PartnerShowcaseTab,
} from "@/lib/cms/partner-showcase";

type Props = {
  activeTab: PartnerShowcaseTab;
  counts: Record<PartnerShowcaseTab, number>;
  onChange: (tab: PartnerShowcaseTab) => void;
};

export default function ShowcaseTabNav({ activeTab, counts, onChange }: Props) {
  return (
    <div className="relative -mx-4 mb-6 px-4 sm:mx-0 sm:px-0">
      <div
        className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center [&::-webkit-scrollbar]:hidden"
        role="tablist"
        aria-label="Partner categories"
      >
        {PARTNER_SHOWCASE_TABS.map((item) => {
          const selected = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`partners-panel-${item.id}`}
              id={`partners-tab-${item.id}`}
              onClick={() => onChange(item.id)}
              className={`shrink-0 rounded-2xl px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-w-[10.5rem] ${
                selected
                  ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/20"
                  : "border border-slate-200/90 bg-white/90 text-slate-700 hover:border-primary/30 hover:bg-white"
              }`}
            >
              <span className="block text-sm font-bold leading-tight">
                {item.shortLabel}
              </span>
              <span
                className={`mt-0.5 block text-[11px] font-medium ${selected ? "text-white/80" : "text-slate-500"}`}
                lang="hi"
              >
                {item.subtitleHi}
              </span>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  selected ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {counts[item.id]} names
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
