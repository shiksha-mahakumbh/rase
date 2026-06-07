import type { Metadata } from "next";
import EntityDirectoryTemplate from "@/components/knowledge-graph/EntityDirectoryTemplate";
import { getEntityDirectory } from "@/lib/knowledge-graph/entity-directories";
import { createPageMetadata } from "@/lib/seo/metadata";

const dir = getEntityDirectory("institutions");

export const metadata: Metadata = createPageMetadata({
  title: `${dir.label} — Shiksha Mahakumbh Abhiyan`,
  description: dir.description,
  path: dir.path,
  keywords: dir.keywords,
});

export default function InstitutionsDirectoryPage() {
  return <EntityDirectoryTemplate directory={dir} />;
}
