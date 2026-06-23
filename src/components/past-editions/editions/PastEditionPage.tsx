import PublicPageShell from "@/components/layouts/PublicPageShell";
import PastEditionDetailShowcase from "@/components/past-editions/editions/PastEditionDetailShowcase";
import PastEditionJsonLd from "@/components/past-editions/PastEditionJsonLd";
import type { EditionDetailContent } from "@/data/editions/types";
import { editionPageHero, getEditionByHref } from "@/data/past-editions";

type Props = {
  path: string;
  content: EditionDetailContent;
};

export default function PastEditionPage({ path, content }: Props) {
  const edition = getEditionByHref(path);
  const hero = editionPageHero(path);

  return (
    <>
      {edition ? <PastEditionJsonLd edition={edition} /> : null}
      <PublicPageShell
        hero={hero}
        showCta={false}
        relatedPath={path}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Past Editions", path: "/past-events" },
          { name: edition?.title ?? `Edition ${content.editionNumber}`, path },
        ]}
        containerClassName="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12"
      >
        <PastEditionDetailShowcase content={content} />
      </PublicPageShell>
    </>
  );
}
