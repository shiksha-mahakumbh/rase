"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchEcosystem, getAllEcosystemTags } from "@/lib/ecosystem/search";
import { kindLabel, type EcosystemKind } from "@/lib/ecosystem/types";
import type { ContentCategory } from "@/lib/content/types";
import { SectionHeader } from "@/components/ui";
import { recordKnowledgeHubView } from "@/components/admin/AdminGrowthDashboard";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";
import { getCategoryLabel } from "@/lib/content/registry";

const KIND_FILTERS: { value: EcosystemKind | ""; label: string }[] = [
  { value: "", label: "All content" },
  { value: "speaker", label: "Speakers" },
  { value: "expert", label: "Experts" },
  { value: "research", label: "Research" },
  { value: "publication", label: "Publications" },
  { value: "case-study", label: "Case Studies" },
  { value: "success-story", label: "Success Stories" },
  { value: "news", label: "News" },
  { value: "event-report", label: "Event Reports" },
];

const CATEGORIES: ContentCategory[] = [
  "article",
  "news",
  "research",
  "policy",
  "insight",
  "event-report",
];

export default function ContentHubClient() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [kind, setKind] = useState<EcosystemKind | "">("");
  const [category, setCategory] = useState<ContentCategory | "">("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    recordKnowledgeHubView();
    trackEvent(ANALYTICS_EVENTS.knowledgeHubView);
  }, []);

  const tags = useMemo(() => getAllEcosystemTags(), []);

  const { items, total, pageSize, totalPages } = useMemo(
    () =>
      searchEcosystem({
        q: q || undefined,
        kind: kind || undefined,
        category: category || undefined,
        tag: tag || undefined,
        page,
        pageSize: 9,
      }),
    [q, kind, category, tag, page]
  );

  return (
    <>
      <SectionHeader
        eyebrow="Knowledge platform"
        title="Knowledge & Content Hub"
        description="Articles, news, research, policy updates, education insights, and event reports — searchable and categorized."
        align="left"
      />

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm md:flex-row md:flex-wrap md:items-end">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm">
          <span className="font-semibold text-gray-700">Search</span>
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Title, tags, excerpt..."
            className="min-h-[44px] rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-gray-700">Type</span>
          <select
            value={kind}
            onChange={(e) => {
              setKind(e.target.value as EcosystemKind | "");
              setPage(1);
            }}
            className="min-h-[44px] rounded-lg border border-gray-200 px-3 py-2"
          >
            {KIND_FILTERS.map((k) => (
              <option key={k.value || "all"} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-gray-700">Category</span>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as ContentCategory | "");
              setPage(1);
            }}
            className="min-h-[44px] rounded-lg border border-gray-200 px-3 py-2"
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {getCategoryLabel(c)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-gray-700">Tag</span>
          <select
            value={tag}
            onChange={(e) => {
              setTag(e.target.value);
              setPage(1);
            }}
            className="min-h-[44px] rounded-lg border border-gray-200 px-3 py-2"
          >
            <option value="">All</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.slug}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-saffron/40"
          >
              <span className="text-xs font-bold uppercase tracking-wider text-brand-saffron">
                {kindLabel(item.kind)}
              </span>
            <h2 className="mt-2 text-lg font-bold text-brand-navy">
              <Link href={item.href} className="hover:underline">
                {item.title}
              </Link>
            </h2>
            <p className="mt-2 flex-1 text-sm text-slate-600">{item.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {item.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>
            <time
              dateTime={item.publishedAt}
              className="mt-3 text-xs text-slate-400"
            >
              {item.publishedAt}
            </time>
          </article>
        ))}
        {!items.length && (
          <p className="col-span-full py-12 text-center text-gray-500">
            No content matches your filters.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="min-h-[44px] rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="min-h-[44px] rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
