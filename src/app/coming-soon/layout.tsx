import { createPageMetadata } from "@/lib/seo/metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createPageMetadata({
  title: "Coming Soon — Shiksha Mahakumbh Abhiyan",
  description:
    "New programmes and platform features launching soon on the Shiksha Mahakumbh national education portal.",
  path: CANONICAL_ROUTES.comingSoon,
  keywords: ["Shiksha Mahakumbh programmes", "upcoming features", "education summit India"],
});

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
