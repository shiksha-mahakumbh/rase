import { createPageMetadata } from "@/lib/seo/metadata";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export const metadata = createPageMetadata({
  title: "Accommodation Booking",
  description:
    "Book accommodation for Shiksha Mahakumbh national education summit programmes and delegate stays.",
  path: CANONICAL_ROUTES.accommodation,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
