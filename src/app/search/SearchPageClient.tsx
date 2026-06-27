"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { globalSearch } from "@/lib/ecosystem/search";
import { kindLabel } from "@/lib/ecosystem/types";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  const results = useMemo(() => globalSearch(q, 24), [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="site-search">
          Search rase.co.in
        </label>
        <input
          id="site-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search speakers, publications, events…"
          className="min-h-[48px] flex-1 rounded-xl border border-slate-200 px-4 text-base"
          autoFocus
        />
        <button
          type="submit"
          className="min-h-[48px] rounded-xl bg-brand-navy px-6 font-semibold text-white"
        >
          Search
        </button>
      </form>

      {q.trim().length >= 2 ? (
        <div className="mt-8">
          <p className="text-sm text-slate-500">
            {results.length
              ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q.trim()}”`
              : `No results for “${q.trim()}”`}
          </p>
          <ul className="mt-4 divide-y rounded-2xl border bg-white">
            {results.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="block px-5 py-4 transition hover:bg-slate-50"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-saffron">
                    {kindLabel(item.kind)}
                  </span>
                  <p className="mt-1 font-semibold text-brand-navy">{item.title}</p>
                  {item.excerpt ? (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.excerpt}</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          Enter at least two characters to search speakers, publications, and programme pages.
        </p>
      )}
    </div>
  );
}
