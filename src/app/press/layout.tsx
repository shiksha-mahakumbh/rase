import { createArticleMetadata } from "@/lib/seo/metadataBuilders";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createArticleMetadata({
  title: "Press Releases",
  description: "Official press releases from Shiksha Mahakumbh Abhiyan.",
  path: CANONICAL_ROUTES.press,
});

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return children;
}
