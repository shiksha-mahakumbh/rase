import type { Metadata } from "next";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import PartnersHub from "@/components/partners/PartnersHub";
import { loadCmsPartners } from "@/lib/cms/organizational";
import { createPageMetadata } from "@/lib/seo/metadata";
import { brandPageHero } from "@/lib/page-heroes";

const FALLBACK = {
  title: "Partners",
  description:
    "Academic, media, government, and industry partners supporting Shiksha Mahakumbh Abhiyan.",
  path: "/partners",
};

export const metadata: Metadata = createPageMetadata(FALLBACK);

export default async function PartnersPage() {
  const partners = await loadCmsPartners();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Partners", path: "/partners" },
        ]}
      />
      <PublicPageShell
        hero={brandPageHero(
          "Our Partners",
          "Academic, media, government, and industry organisations united for national education reform.",
          "Collaboration"
        )}
        relatedPath="/partners"
        showCta={false}
      >
        <PartnersHub partners={partners} />
      </PublicPageShell>
    </>
  );
}
