"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { normalizeStaticImageSrc } from "@/lib/images/normalizeStaticImageSrc";

const EventImageSlider = dynamic(() => import("@/components/media/EventImageSlider"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[320px] animate-pulse rounded-lg bg-slate-100" aria-hidden />
  ),
});

export default function EditionGallery({
  images,
  eventTitle,
}: {
  images: readonly string[];
  eventTitle: string;
}) {
  if (!images.length) return null;

  const primary = normalizeStaticImageSrc(images[0]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
      <div className="relative aspect-[5/2] w-full bg-slate-50">
        <Image
          src={primary}
          alt={`${eventTitle} — featured photo`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 896px"
          className="object-contain p-2"
        />
      </div>
      {images.length > 1 ? (
        <div className="border-t border-slate-100 p-2">
          <EventImageSlider images={[...images.slice(1)]} eventTitle={eventTitle} />
        </div>
      ) : null}
    </div>
  );
}
