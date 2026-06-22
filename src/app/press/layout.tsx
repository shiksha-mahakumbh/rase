import { createArticleMetadata } from "@/lib/seo/metadataBuilders";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";
import { PRESS_SEO_KEYWORDS } from "@/data/press-hub";

export const metadata = createArticleMetadata({
  title: "Press Releases — Shiksha Mahakumbh Abhiyan",
  description:
    "Official press releases and national coverage from Shiksha Mahakumbh Abhiyan — English and Hindi announcements for media, institutions, and global education stakeholders.",
  path: CANONICAL_ROUTES.press,
  keywords: [...PRESS_SEO_KEYWORDS],
});

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
