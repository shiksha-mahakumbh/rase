"use client";

import { useMemo } from "react";
import { getInternalLinksForPath } from "@/lib/knowledge-graph/internal-link-engine";
import { DEFAULT_RELATED_LINK_LIMIT } from "@/lib/knowledge-graph/site-cleanup";
import InternalLinksBlock from "./InternalLinksBlock";

type Props = {
  path: string;
  title?: string;
  limit?: number;
  excludePaths?: string[];
  className?: string;
};

/** Client pages (Press, proceedings shell) — same link engine as server. */
export default function RelatedContentSectionClient({
  path,
  title = "Related programmes & resources",
  limit = DEFAULT_RELATED_LINK_LIMIT,
  excludePaths = [],
  className = "mx-auto max-w-5xl px-4 py-8 bg-white",
}: Props) {
  const links = useMemo(() => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    const exclude = new Set([normalized, ...excludePaths]);
    return getInternalLinksForPath(normalized, limit + exclude.size)
      .filter((l) => !exclude.has(l.href))
      .slice(0, limit);
  }, [path, limit, excludePaths]);

  if (!links.length) return null;

  return (
    <div className={className}>
      <InternalLinksBlock title={title} links={links} />
    </div>
  );
}
