"use client";

import { useState } from "react";
import type { TickerItem } from "@/data/default-announcements";
import { TickerChip } from "./TickerChip";

type Props = {
  items: readonly TickerItem[];
};

/** CSS marquee — content is SSR'd from props (no client fetch / DOM swap). */
export default function MarqueeTrack({ items }: Props) {
  const [paused, setPaused] = useState(false);
  const loop = items.length > 0 ? [...items, ...items] : items;

  return (
    <div className="overflow-hidden rounded-xl border border-brand-saffron/20 bg-white/90 shadow-sm">
      <div className="flex items-center justify-end px-2 pt-1">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="min-h-[44px] rounded-lg px-3 text-xs font-semibold text-brand-navy hover:bg-brand-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-saffron"
          aria-pressed={paused}
        >
          {paused ? "Play announcements" : "Pause announcements"}
        </button>
      </div>
      <div className="overflow-hidden">
        <div
          className={`flex w-max gap-3 px-3 py-2 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center ${
            paused
              ? "motion-reduce:animate-none"
              : "[animation:marquee-scroll_40s_linear_infinite] motion-reduce:animate-none"
          }`}
          aria-live="off"
        >
          {loop.map((item, index) => (
            <TickerChip key={`${item.href}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
