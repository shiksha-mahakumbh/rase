import { createPageMetadata } from "@/lib/seo/metadata";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata = createPageMetadata({
  title: "DHE Initiatives — National Education Programmes",
  description:
    "Explore flagship initiatives of the Department of Holistic Education: innovation, olympiads, awards, skill development, teacher programmes, and student development under Shiksha Mahakumbh.",
  path: "/initiatives",
  keywords: [
    "DHE initiatives",
    "education programmes India",
    "Shiksha Mahakumbh programmes",
    "DHE Olympiad",
  ],
});

export default function InitiativesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Education", path: "/education" },
          { name: "Initiatives", path: "/initiatives" },
        ]}
      />
      {children}
    </>
  );
}
