import Link from "next/link";
import type { PastEditionRecord } from "@/data/past-editions";

export default function EditionPrevNext({
  prev,
  next,
}: {
  prev?: PastEditionRecord;
  next?: PastEditionRecord;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Other Shiksha Mahakumbh editions"
      className="flex flex-col gap-3 border-b border-slate-200 pb-8 sm:flex-row sm:justify-between"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-brand-saffron/40 hover:shadow-sm"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            ← Previous edition
          </span>
          <span className="mt-1 block font-bold text-brand-navy group-hover:text-brand-blue">
            {prev.title}
          </span>
          <span className="text-xs text-slate-500">{prev.venue} · {prev.dates}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-brand-saffron/40 hover:shadow-sm sm:text-right"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Next edition →
          </span>
          <span className="mt-1 block font-bold text-brand-navy group-hover:text-brand-blue">
            {next.title}
          </span>
          <span className="text-xs text-slate-500">{next.venue} · {next.dates}</span>
        </Link>
      ) : null}
    </nav>
  );
}
