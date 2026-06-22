"use client";

import Link from "next/link";
import SlideShow from "@/components/home/sections/SlideShow";
import { SectionHeader } from "@/components/ui";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionItems } from "@/lib/cms/utils";
import { homeSlides, type HomeSlide } from "./slides-data";

export default function GallerySection() {
  const cms = useCms();
  const gallery = getSection(cms?.homepage, "gallery");
  const items = sectionItems<{ src?: string; alt?: string; legend?: string }>(
    gallery,
    "items"
  );
  const resolved = items
    .filter((item) => item.src)
    .map((item) => ({
      src: item.src!,
      alt: item.alt ?? "",
      legend: item.legend ?? "",
    }));
  const slides: HomeSlide[] = resolved.length > 0 ? resolved : homeSlides;
  return (
    <section aria-label="Event gallery" className="bg-brand-navy py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Gallery"
          title="Moments From Past Editions"
          description="Dignitaries, ceremonies, research releases, and national participation."
          align="center"
        />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2 md:p-4">
          <SlideShow slides={slides} />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/gallery"
            className="rounded-full bg-brand-saffron px-6 py-2.5 text-sm font-bold text-brand-navy shadow-sm transition hover:bg-brand-saffron-dark hover:text-white"
          >
            View Full Gallery
          </Link>
          <Link
            href="/gallery?tab=videos"
            className="rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Watch on YouTube
          </Link>
        </div>
      </div>
    </section>
  );
}
