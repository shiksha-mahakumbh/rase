import type { Metadata } from "next";
import { loadCmsNotices, loadDefaultOgImage, loadRouteSeo } from "@/lib/cms/server";
import NoticeboardClient from "./NoticeboardClient";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { buildNewsArticleSchema } from "@/server/services/seo.service";
import { SITE_URL } from "@/config/site";

export const revalidate = 300;

const FALLBACK_META = {
  title: "Notice Board — Campus Updates & Announcements",
  description:
    "Official notices, circulars, deadlines, and programme announcements for Shiksha Mahakumbh Abhiyan.",
  path: "/noticeboard",
  keywords: ["Shiksha Mahakumbh notices", "campus announcements", "education circulars"],
};

export async function generateMetadata(): Promise<Metadata> {
  const [seo, ogImage] = await Promise.all([
    loadRouteSeo("noticeboard"),
    loadDefaultOgImage(),
  ]);

  if (seo) {
    return metadataFromCmsSeo(seo, { ...FALLBACK_META, ogImageUrl: ogImage });
  }

  return createPageMetadata({ ...FALLBACK_META, ogImageUrl: ogImage ?? undefined });
}

import { brandPageHero } from "@/lib/page-heroes";

export default async function NoticeboardPage() {
  const notices = await loadCmsNotices(50);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shiksha Mahakumbh Notice Board",
    url: `${SITE_URL}/noticeboard`,
    hasPart: notices.slice(0, 10).map((n) =>
      buildNewsArticleSchema({
        headline: n.title,
        datePublished: n.publishAt ?? new Date().toISOString(),
        url: `/noticeboard#${n.slug}`,
        description: n.description.slice(0, 160),
      })
    ),
  };

  return (
    <PublicPageShell
      hero={brandPageHero(
        "Notice Board",
        "Campus notices, deadlines, and programme announcements.",
        "Live Updates"
      )}
      showCta={false}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Notice Board", path: "/noticeboard" },
      ]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoticeboardClient initialNotices={notices} />
    </PublicPageShell>
  );
}
