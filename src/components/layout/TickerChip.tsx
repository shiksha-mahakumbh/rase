import Image from "next/image";
import Link from "next/link";
import type { TickerItem } from "@/data/default-announcements";

export function TickerChip({ item }: { item: TickerItem }) {
  const content = (
    <span className="mx-1 flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-1.5 text-sm font-medium text-gray-800 shadow-sm">
      <Image
        src="/new.gif"
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 shrink-0"
        unoptimized
      />
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
