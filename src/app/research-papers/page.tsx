import type { Metadata } from "next";
import PublicationTypePage from "@/components/knowledge-graph/PublicationTypePage";
import { getPublicationType } from "@/lib/knowledge-graph/publication-catalog";
import { createPageMetadata } from "@/lib/seo/metadata";

const entry = getPublicationType("research-papers");

export const metadata: Metadata = createPageMetadata({
  title: `${entry.label} — Shiksha Mahakumbh`,
  description: entry.description,
  path: entry.path,
});

export default function ResearchPapersPage() {
  return <PublicationTypePage entry={entry} />;
}
