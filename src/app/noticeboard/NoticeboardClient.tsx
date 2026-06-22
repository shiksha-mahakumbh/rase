"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { CmsNotice } from "@/lib/cms/types";

type Props = {
  initialNotices: CmsNotice[];
};

type TabKey = "all" | "pinned";

function CategoryBadge({ name }: { name: string }) {
  return (
    <span className="rounded-full bg-brand-saffron/15 px-2.5 py-0.5 text-xs font-semibold text-brand-navy">
      {name}
    </span>
  );
}

export default function NoticeboardClient({ initialNotices }: Props) {
  const [notices, setNotices] = useState(initialNotices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const n of notices) {
      if (n.category) map.set(n.category.slug, n.category.name);
    }
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [notices]);

  const filtered = useMemo(() => {
    let list = [...notices];
    if (activeTab === "pinned") list = list.filter((n) => n.isPinned);
    if (categoryFilter) list = list.filter((n) => n.category?.slug === categoryFilter);
    return list.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.priority - a.priority;
    });
  }, [notices, activeTab, categoryFilter]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v2/notices?limit=50", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load notices");
      const data = (await res.json()) as { items: CmsNotice[] };
      setNotices(data.items ?? []);
    } catch {
      setError("Unable to refresh notices. Showing cached list.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-brand-navy">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-4 md:px-6">
          <h2 className="text-lg font-bold text-brand-navy">All notices</h2>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh notices"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-brand-navy hover:bg-brand-surface-warm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron disabled:opacity-50"
          >
            <span aria-hidden="true">↻</span>
          </button>
        </div>

        {error && (
          <div role="alert" className="m-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {error}
          </div>
        )}

        <div className="p-4 md:p-6">
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Notice filters">
            {(
              [
                { key: "all" as const, label: "All Notices" },
                { key: "pinned" as const, label: "Pinned" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron ${
                  activeTab === tab.key
                    ? "bg-brand-navy text-white"
                    : "bg-white text-brand-navy ring-1 ring-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setCategoryFilter(categoryFilter === cat.slug ? null : cat.slug)}
                className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron ${
                  categoryFilter === cat.slug
                    ? "bg-brand-saffron text-white"
                    : "bg-white ring-1 ring-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3" aria-busy="true" aria-label="Loading notices">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-600">No notices available.</p>
          ) : (
            <ul className="space-y-4" role="list">
              {filtered.map((notice) => (
                <li
                  key={notice.id}
                  id={notice.slug}
                  className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-saffron/30 hover:shadow-sm md:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-brand-navy md:text-lg">{notice.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {notice.isPinned && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                          Pinned
                        </span>
                      )}
                      {notice.category && <CategoryBadge name={notice.category.name} />}
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {notice.description}
                  </p>
                  {notice.attachments.length > 0 && (
                    <ul className="mt-3 space-y-1" aria-label="Attachments">
                      {notice.attachments.map((att) => (
                        <li key={att.id}>
                          <a
                            href={att.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand-navy underline hover:text-brand-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
                          >
                            📎 {att.fileName}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
