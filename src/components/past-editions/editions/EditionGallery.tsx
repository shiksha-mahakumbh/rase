import Image from "next/image";
import { normalizeStaticImageSrc } from "@/lib/images/normalizeStaticImageSrc";
import EditionGalleryStrip from "./EditionGalleryStrip";

/** Server-rendered edition gallery — single priority LCP image + lazy scroll strip. */
export default function EditionGallery({
  images,
  eventTitle,
}: {
  images: readonly string[];
  eventTitle: string;
}) {
  if (!images.length) return null;

  const primary = normalizeStaticImageSrc(images[0]);
  const rest = images.slice(1);

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
      {rest.length > 0 ? (
        <EditionGalleryStrip images={rest} eventTitle={eventTitle} />
      ) : null}
    </div>
  );
}
