import PublicPageShell from "@/components/layouts/PublicPageShell";
import JsonLd from "@/components/seo/JsonLd";
import ConferencesShowcase from "@/components/conferences/ConferencesShowcase";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
} from "@/lib/seo/schema";
import { CONFERENCE_YEAR_ARCHIVE } from "@/lib/knowledge-graph/conference-catalog";
import { getPillarEntry } from "@/lib/knowledge-graph/pillar-registry";
import { SITE_URL } from "@/config/site";
import type { CmsEventCard } from "@/lib/cms/types";

type Props = {
  cmsEvents?: CmsEventCard[];
};

export default function ConferenceAuthorityHub({ cmsEvents = [] }: Props) {
  const pillar = getPillarEntry("conferences")!;

  const collection = buildCollectionPageSchema({
    name: "Conferences & Programmes — Shiksha Mahakumbh",
    description: pillar.intro,
    path: "/conferences",
  });

  const itemList = buildItemListSchema({
    name: "Conference & event programmes",
    items: [
      { name: "Upcoming Events", url: `${SITE_URL}/upcoming-events` },
      { name: "Past Editions", url: `${SITE_URL}/past-events` },
      { name: "Workshops", url: `${SITE_URL}/workshops` },
      { name: "Registration", url: `${SITE_URL}/registration` },
      { name: "Proceedings", url: `${SITE_URL}/proceedings` },
      ...cmsEvents.map((e) => ({
        name: e.title,
        url: `${SITE_URL}${e.href}`,
      })),
      ...CONFERENCE_YEAR_ARCHIVE.flatMap((y) =>
        y.routes.map((r) => ({ name: `${y.label} — ${r.label}`, url: `${SITE_URL}${r.path}` }))
      ),
    ],
  });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Conferences", path: "/conferences" },
  ]);

  return (
    <PublicPageShell
      showHero={false}
      relatedPath="/conferences"
      showCta={false}
      skipContainer
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Conferences", path: "/conferences" },
      ]}
    >
      <JsonLd data={collection} />
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbs} />
      <ConferencesShowcase cmsEvents={cmsEvents} />
    </PublicPageShell>
  );
}
