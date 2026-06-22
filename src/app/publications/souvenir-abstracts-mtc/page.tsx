import PublicPageShell from "@/components/layouts/PublicPageShell";
import SouvenirAbstractsShowcase from "@/components/publications/SouvenirAbstractsShowcase";
import SouvenirAbstractsJsonLd from "@/components/publications/SouvenirAbstractsJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  SOUVENIR_ABSTRACTS_PAGE_PATH,
  SOUVENIR_CATALOG,
  SOUVENIR_PAGE_HERO,
  SOUVENIR_SEO_KEYWORDS,
} from "@/data/souvenir-abstracts-hub";
import { SITE_URL } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Souvenir Abstracts — Multi Track Conference | Shiksha Mahakumbh",
  description: SOUVENIR_PAGE_HERO.subtitle,
  path: SOUVENIR_ABSTRACTS_PAGE_PATH,
  keywords: [...SOUVENIR_SEO_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: `${SITE_URL}/souvenir-mtc/smk-4.0-cover.jpg`,
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Publications", path: "/publications" },
  { name: "Souvenir Abstracts MTC", path: SOUVENIR_ABSTRACTS_PAGE_PATH },
];

export default function SouvenirAbstractsMtcPage() {
  return (
    <PublicPageShell
      showHero={false}
      showCta={false}
      skipContainer
      relatedPath="/publications"
      breadcrumbs={BREADCRUMBS}
    >
      <SouvenirAbstractsJsonLd />
      <SouvenirAbstractsShowcase />
    </PublicPageShell>
  );
}
