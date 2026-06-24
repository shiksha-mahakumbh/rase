"use client";

import type { TickerItem } from "@/data/default-announcements";
import { TickerChip } from "./TickerChip";

type Props = {
  items: readonly TickerItem[];
};

/** CSS marquee — content is SSR'd from props (no client fetch / DOM swap). */
export default function MarqueeTrack({ items }: Props) {
  const loop = items.length > 0 ? [...items, ...items] : items;

  return (
    <div className="overflow-hidden rounded-xl border border-brand-saffron/20 bg-white/90 shadow-sm">
      <div className="overflow-hidden">
        <div
          className="flex w-max gap-3 px-3 py-2 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center [animation:marquee-scroll_40s_linear_infinite] motion-reduce:animate-none"
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
