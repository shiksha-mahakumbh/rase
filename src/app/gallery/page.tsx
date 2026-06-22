import { Suspense } from "react";
import GalleryJsonLd from "@/components/gallery/GalleryJsonLd";
import GalleryShowcase from "@/components/gallery/GalleryShowcase";
import PublicPageShell from "@/components/layouts/PublicPageShell";

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/gallery" },
];

export default function GalleryRoutePage() {
  return (
    <PublicPageShell
      showHero={false}
      showCta={false}
      breadcrumbs={BREADCRUMBS}
      relatedPath="/gallery"
      skipContainer
    >
      <GalleryJsonLd />
      <Suspense
        fallback={
          <div className="py-16 text-center text-slate-600">Loading gallery…</div>
        }
      >
        <GalleryShowcase />
      </Suspense>
    </PublicPageShell>
  );
}
