"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { globalSearch } from "@/lib/ecosystem/search";
import { kindLabel } from "@/lib/ecosystem/types";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";

type GlobalSearchProps = {
  compact?: boolean;
  autoFocus?: boolean;
};

export default function GlobalSearchInner({
  compact = false,
  autoFocus = false,
}: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => globalSearch(q, 8), [q]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="sr-only" htmlFor="global-search">
        Search site
      </label>
      <input
        ref={inputRef}
        id="global-search"
        type="search"
        placeholder="Search..."
        value={q}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className={`min-h-[40px] rounded-lg border border-slate-200 px-3 text-sm ${compact ? "w-full min-w-0" : "w-36 min-w-[9rem] sm:w-44 xl:w-44"}`}
        aria-controls={open ? "global-search-results" : undefined}
      />

      {open && q.trim().length >= 2 && (
        <ul
          id="global-search-results"
          role="listbox"
          className="absolute right-0 z-50 mt-2 max-h-80 w-72 overflow-y-auto rounded-xl border bg-white py-2 shadow-xl md:w-96"
        >
          {results.length ? (
            results.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 hover:bg-slate-50"
                  onClick={() => {
                    trackEvent(ANALYTICS_EVENTS.globalSearch, {
                      source: item.kind,
                    });
                    setOpen(false);
                  }}
                >
                  <span className="text-xs font-semibold text-brand-saffron">
                    {kindLabel(item.kind)}
                  </span>
                  <p className="text-sm font-medium text-brand-navy">{item.title}</p>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-sm text-gray-500">No results</li>
          )}
          <li className="border-t px-4 py-2">
            <Link
              href={`/search?q=${encodeURIComponent(q)}`}
              className="text-sm font-semibold text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              View all results →
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
