import CommitteesJsonLd from "@/components/committee/CommitteesJsonLd";
import { createPageMetadata } from "@/lib/seo/metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import {
  COMMITTEES_OG_IMAGE,
  COMMITTEES_PAGE_HERO,
  COMMITTEES_SEO_KEYWORDS,
} from "@/data/committee-hub";

export const metadata = createPageMetadata({
  title: COMMITTEES_PAGE_HERO.title,
  description:
    "Browse advisory, organising, and conference committees for Shiksha Mahakumbh Abhiyan editions 1.0–6.0. National education leadership from IITs, NITs, central universities, Vidya Bharti, and DHE.",
  path: CANONICAL_ROUTES.committees,
  keywords: [...COMMITTEES_SEO_KEYWORDS],
  locale: "en_IN",
  ogImageUrl: COMMITTEES_OG_IMAGE,
});

export default function CommitteesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CommitteesJsonLd />
      {children}
    </>
  );
}
