import Link from "next/link";
import type { TickerItem } from "@/data/default-announcements";

function NewBadge() {
  return (
    <span
      className="inline-flex h-[11px] shrink-0 items-center rounded-sm bg-red-600 px-1 text-[8px] font-extrabold uppercase leading-none tracking-wide text-white"
      aria-hidden
    >
      New
    </span>
  );
}

export function TickerChip({ item }: { item: TickerItem }) {
  const content = (
    <span className="mx-1 flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-1.5 text-sm font-medium text-gray-800 shadow-sm">
      <NewBadge />
      {item.text}
    </span>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={item.href}>{content}</Link>;
}
