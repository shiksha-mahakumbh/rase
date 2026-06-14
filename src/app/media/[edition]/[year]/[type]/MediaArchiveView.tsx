"use client";

import React from "react";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import {
  getMediaArchiveComponent,
  type MediaArchiveKey,
} from "@/data/media-archive-components";

import { getEditionByNumber } from "@/data/past-editions";

function archiveHero(key: MediaArchiveKey) {
  const [, edition, type] = key.split("/");
  const ed = getEditionByNumber(edition);
  const typeLabel = type === "digital" ? "Digital Media" : "Print Media";
  return {
    eyebrow: "Media Archive",
    title: `${ed?.title ?? `Shiksha Mahakumbh ${edition}`} — ${typeLabel}`,
    subtitle: `Edition-wise ${typeLabel.toLowerCase()} coverage and highlights.`,
    accent: "navy" as const,
  };
}

export default function MediaArchiveView({ archiveKey }: { archiveKey: MediaArchiveKey }) {
  const Archive = getMediaArchiveComponent(archiveKey);

  return (
    <PublicPageShell
      hero={archiveHero(archiveKey)}
      relatedPath="/media-center"
      skipContainer
    >
      <React.Suspense fallback={<div className="p-8 text-center text-slate-600">Loading archive…</div>}>
        <Archive />
      </React.Suspense>
    </PublicPageShell>
  );
}
