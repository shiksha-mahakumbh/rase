import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo/metadata";
import PillarPageTemplate from "@/components/knowledge-graph/PillarPageTemplate";
import { getPillarEntry, type PillarSlug } from "./pillar-registry";

export function createPillarMetadata(slug: PillarSlug): Metadata {
  const entry = getPillarEntry(slug);
  if (!entry) {
    return createPageMetadata({
      title: "Education",
      description: "Shiksha Mahakumbh education ecosystem",
      path: "/education",
    });
  }
  return createPageMetadata({
    title: `${entry.label} — Shiksha Mahakumbh Abhiyan`,
    description: entry.intro,
    path: entry.path,
    keywords: entry.keywords,
  });
}

export function createPillarPage(slug: PillarSlug) {
  return function PillarPage() {
    return <PillarPageTemplate slug={slug} />;
  };
}
