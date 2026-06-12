"use client";

import { useMemo, useState } from "react";
import type { CmsDownload } from "@/lib/cms/types";

const TYPE_LABELS: Record<string, string> = {
  brochure: "Brochures",
  report: "Reports",
  guidelines: "Guidelines",
  circular: "Circulars",
  poster: "Posters",
  presentation: "Presentations",
  other: "Other",
};

type Props = { initialDownloads: CmsDownload[] };

export default function DownloadsClient({ initialDownloads }: Props) {
  const [downloads, setDownloads] = useState(initialDownloads);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const types = useMemo(
    () => Array.from(new Set(downloads.map((d) => d.downloadType))),
    [downloads]
  );
  const categories = useMemo(
    () =>
      Array.from(
        new Set(downloads.map((d) => d.category).filter((c): c is string => Boolean(c)))
      ),
    [downloads]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return downloads.filter((d) => {
      if (typeFilter && d.downloadType !== typeFilter) return false;
      if (categoryFilter && d.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [downloads, search, typeFilter, categoryFilter]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v2/downloads?limit=100", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { items: CmsDownload[] };
        setDownloads(data.items ?? []);
      }
    } finally {
      setLoading(false);
    }
  };

  const trackAndOpen = async (id: string, url: string) => {
    fetch(`/api/v2/downloads/${id}/track`, { method: "POST" }).catch(() => undefined);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="download-search" className="mb-1 block text-sm font-semibold text-brand-navy">
            Search downloads
          </label>
          <input
            id="download-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, tag, or description…"
            className="w-full min-h-[44px] rounded-lg border border-slate-300 px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
          />
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="min-h-[44px] rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTypeFilter(null)}
          className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold ${
            !typeFilter ? "bg-brand-navy text-white" : "bg-white ring-1 ring-slate-200"
          }`}
        >
          All types
        </button>
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(typeFilter === t ? null : t)}
            className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold ${
              typeFilter === t ? "bg-brand-saffron text-white" : "bg-white ring-1 ring-slate-200"
            }`}
          >
            {TYPE_LABELS[t] ?? t}
          </button>
        ))}
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategoryFilter(categoryFilter === c ? null : c)}
            className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold ${
              categoryFilter === c ? "bg-emerald-600 text-white" : "bg-white ring-1 ring-slate-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-slate-600">No downloads match your filters.</p>
      ) : (
        <ul className="space-y-4" role="list">
          {filtered.map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-brand-navy">{d.title}</h3>
                  {d.description && (
                    <p className="mt-1 text-sm text-slate-600">{d.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold uppercase">
                      {TYPE_LABELS[d.downloadType] ?? d.downloadType}
                    </span>
                    {d.category && (
                      <span className="rounded bg-slate-100 px-2 py-0.5">{d.category}</span>
                    )}
                    <span>{d.downloadCount} downloads</span>
                  </div>
                  {d.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {d.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-brand-saffron/10 px-2 py-0.5 text-xs text-brand-navy">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => trackAndOpen(d.id, d.fileUrl)}
                  className="min-h-[44px] shrink-0 rounded-lg bg-brand-navy px-5 py-2 text-sm font-bold text-white hover:bg-brand-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                >
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
