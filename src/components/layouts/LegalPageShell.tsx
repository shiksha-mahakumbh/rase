import PublicPageShell from "./PublicPageShell";
import LegalRelatedLinks from "./LegalRelatedLinks";
import { brandPageHero } from "@/lib/page-heroes";

export default function LegalPageShell({
  title,
  path,
  children,
}: {
  title: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <PublicPageShell
      hero={brandPageHero(
        title,
        "Official policies governing use of the Shiksha Mahakumbh platform.",
        "Legal"
      )}
      showCta={false}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: title, path },
      ]}
      containerClassName="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16"
    >
      <article className="prose prose-slate max-w-none prose-headings:text-brand-navy prose-a:text-brand-saffron">
        {children}
        <LegalRelatedLinks currentPath={path} />
      </article>
    </PublicPageShell>
  );
}
