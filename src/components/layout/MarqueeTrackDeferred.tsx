"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { TickerItem } from "@/data/default-announcements";
import { TickerChip } from "./TickerChip";

const MarqueeTrack = dynamic(() => import("./MarqueeTrack"), { ssr: false });

function TickerStaticPreview({ items }: { items: readonly TickerItem[] }) {
  const preview = items.slice(0, 4);
  return (
    <div className="overflow-hidden rounded-xl border border-brand-saffron/20 bg-white/90 shadow-sm">
      <div className="flex flex-wrap justify-center gap-3 px-3 py-2">
        {preview.map((item, index) => (
          <TickerChip key={`${item.href}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

/** Static chips first; animated marquee after idle to keep LCP path clear. */
export default function MarqueeTrackDeferred({ items }: { items: readonly TickerItem[] }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const arm = () => setAnimated(true);
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(arm, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(arm, 1500);
    return () => window.clearTimeout(t);
  }, []);

  if (!animated) {
    return <TickerStaticPreview items={items} />;
  }

  return <MarqueeTrack items={items} />;
}
