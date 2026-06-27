import { Suspense } from "react";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import SearchPageClient from "./SearchPageClient";
import { createPageMetadata } from "@/lib/seo/metadata";
import { brandPageHero } from "@/lib/page-heroes";

export const metadata = createPageMetadata({
  title: "Search",
  description:
    "Search Shiksha Mahakumbh speakers, publications, proceedings, events, and programme pages on rase.co.in.",
  path: "/search",
});

export default function SearchPage() {
  return (
    <PublicPageShell
      hero={brandPageHero("Search", "Find speakers, publications, and programme pages.", "Site")}
      skipContainer
    >
      <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading search…</div>}>
        <SearchPageClient />
      </Suspense>
    </PublicPageShell>
  );
}
