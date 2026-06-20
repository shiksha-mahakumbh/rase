import PublicPageShell from "./PublicPageShell";
import { brandPageHero } from "@/lib/page-heroes";

export default function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <PublicPageShell
      hero={brandPageHero(
        title,
        "Official policies governing use of the Shiksha Mahakumbh platform.",
        "Legal"
      )}
      containerClassName="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16"
    >
      <article className="prose prose-slate max-w-none prose-headings:text-brand-navy prose-a:text-brand-saffron">
        {children}
      </article>
    </PublicPageShell>
  );
}
