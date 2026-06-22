import type { Metadata } from "next";
import { loadCmsNotices, loadDefaultOgImage, loadRouteSeo } from "@/lib/cms/server";
import NoticeboardShowcase from "@/components/noticeboard/NoticeboardShowcase";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { buildNewsArticleSchema } from "@/server/services/seo.service";
import { SITE_URL } from "@/config/site";

export const revalidate = 300;

const FALLBACK_META = {
  title: "Notice Board — Campus Updates & Announcements",
  description:
    "Official notices, circulars, deadlines, and programme announcements for Shiksha Mahakumbh Abhiyan — for national and international delegates.",
  path: "/noticeboard",
  keywords: [
    "Shiksha Mahakumbh notices",
    "campus announcements",
    "education circulars",
    "SMK 6.0 deadlines",
    "conference announcements India",
  ],
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
      showHero={false}
      showCta={false}
      relatedPath="/noticeboard"
      skipContainer
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Notice Board", path: "/noticeboard" },
      ]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NoticeboardShowcase initialNotices={notices} />
    </PublicPageShell>
  );
}
