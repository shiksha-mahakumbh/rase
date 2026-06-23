import Image from "next/image";
import { normalizeStaticImageSrc } from "@/lib/images/normalizeStaticImageSrc";

/**
 * Lightweight horizontal gallery — CSS scroll-snap only (no react-slick).
 * Images are lazy-loaded; strip is below the LCP hero image.
 */
export default function EditionGalleryStrip({
  images,
  eventTitle,
}: {
  images: readonly string[];
  eventTitle: string;
}) {
  if (!images.length) return null;

  return (
    <div
      className="border-t border-slate-100 p-2"
      aria-label={`More photos from ${eventTitle}`}
    >
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch]">
        {images.map((src, index) => {
          const normalized = normalizeStaticImageSrc(src);
          return (
            <div
              key={src}
              className="relative h-48 w-[min(85vw,20rem)] shrink-0 snap-center overflow-hidden rounded-lg bg-slate-50 sm:h-52"
            >
              <Image
                src={normalized}
                alt={`${eventTitle} — photo ${index + 2}`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 85vw, 20rem"
                className="object-contain p-1"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
