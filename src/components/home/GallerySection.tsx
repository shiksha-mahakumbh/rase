"use client";

import SlideShow from "@/app/component/SlideShow";
import { SectionHeader } from "@/components/ui";
import { homeSlides } from "./slides-data";

export default function GallerySection() {
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
          <SlideShow slides={homeSlides} />
        </div>
      </div>
    </section>
  );
}
