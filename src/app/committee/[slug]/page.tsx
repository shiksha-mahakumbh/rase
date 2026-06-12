import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsCommitteeView from "@/components/committee/CmsCommitteeView";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { loadCmsCommitteeBySlug } from "@/lib/cms/organizational";
import {
  COMMITTEE_LEGACY_SLUGS,
  getCommitteeLegacyEntry,
} from "@/lib/committee/legacy-registry";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";
import { committeeYearMeta } from "@/lib/seo/publicPages";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cms = await loadCmsCommitteeBySlug(slug);
  const legacy = getCommitteeLegacyEntry(slug);

  if (cms) {
    return metadataFromCmsSeo(cms.seo, {
      title: cms.name,
      description: cms.description ?? `Organising committee for ${cms.name}.`,
      path: `/committee/${slug}`,
      ogImageUrl: cms.seo?.ogImageUrl,
    });
  }

  if (legacy) {
    return committeeYearMeta(slug, legacy.edition, legacy.year);
  }

  return { title: "Committee" };
}

export default async function CommitteeSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const cms = await loadCmsCommitteeBySlug(slug);

  if (cms) {
    return (
      <>
        <BreadcrumbJsonLd
          items={[
            { name: "Home", path: "/" },
            { name: "Committee", path: "/committees" },
            { name: cms.name, path: `/committee/${slug}` },
          ]}
        />
        <CmsCommitteeView committee={cms} />
      </>
    );
  }

  const legacy = getCommitteeLegacyEntry(slug);
  if (!legacy) notFound();

  const { default: LegacyEdition } = await legacy.component();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Committee", path: "/committees" },
          { name: legacy.breadcrumbLabel, path: `/committee/${slug}` },
        ]}
      />
      <LegacyEdition />
    </>
  );
}

export function generateStaticParams() {
  return COMMITTEE_LEGACY_SLUGS.map((slug) => ({ slug }));
}
