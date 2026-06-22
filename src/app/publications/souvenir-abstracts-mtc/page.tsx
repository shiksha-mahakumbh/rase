import PublicPageShell from "@/components/layouts/PublicPageShell";
import SouvenirAbstractsShowcase from "@/components/publications/SouvenirAbstractsShowcase";
import SouvenirAbstractsJsonLd from "@/components/publications/SouvenirAbstractsJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  SOUVENIR_ABSTRACTS_PAGE_PATH,
  SOUVENIR_OG_IMAGES,
  SOUVENIR_PAGE_SEO,
  SOUVENIR_SEO_KEYWORDS,
} from "@/data/souvenir-abstracts-hub";

export const metadata = createPageMetadata({
  title: SOUVENIR_PAGE_SEO.title,
  description: SOUVENIR_PAGE_SEO.description,
  path: SOUVENIR_ABSTRACTS_PAGE_PATH,
  keywords: [...SOUVENIR_SEO_KEYWORDS],
  locale: "en_IN",
  ogImages: SOUVENIR_OG_IMAGES,
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
