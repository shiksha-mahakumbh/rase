"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const ImageLightbox = dynamic(() => import("@/components/ui/ImageLightbox"), {
  ssr: false,
});

type Props = {
  title: string;
  description?: string;
  images: readonly { src: string; alt?: string }[];
  initialCount?: number;
  columnCount?: number;
};

/** Lazy-loaded print clippings grid — no heavy deps. */
export default function PrintMediaArchiveGrid({
  title,
  description,
  images,
  initialCount = 20,
  columnCount = 4,
}: Props) {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const visible = showAll ? images : images.slice(0, initialCount);

  const grouped = useMemo(() => {
    const cols: { src: string; alt?: string }[][] = Array.from(
      { length: columnCount },
      () => []
    );
    visible.forEach((img, index) => {
      cols[index % columnCount].push(img);
    });
    return cols;
  }, [visible, columnCount]);

  return (
    <div className="bg-slate-50 p-4 md:p-8">
      <h1 className="mb-4 text-center text-2xl font-bold text-brand-navy md:text-3xl">{title}</h1>
      {description ? (
        <p className="mx-auto mb-8 max-w-3xl text-center text-slate-600">{description}</p>
      ) : null}

      <div className="-mx-2 flex flex-wrap">
        {grouped.map((column, colIndex) => (
          <div key={colIndex} className="w-full px-2 sm:w-1/2 md:w-1/3 lg:w-1/4">
            {column.map((image, imgIndex) => (
              <button
                key={image.src}
                type="button"
                className="mb-4 w-full text-left"
                onClick={() => setSelectedImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.alt ?? `Print clipping ${imgIndex + 1}`}
                  width={300}
                  height={200}
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="h-auto w-full rounded-lg border border-slate-200 shadow-sm"
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      {images.length > initialCount ? (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-brand-saffron px-6 py-2.5 text-sm font-bold text-brand-navy transition hover:bg-brand-saffron-dark hover:text-white"
          >
            {showAll ? "Show less" : `Show all (${images.length})`}
          </button>
        </div>
      ) : null}

      {selectedImage ? (
        <ImageLightbox
          isOpen
          imageSrc={selectedImage}
          onClose={() => setSelectedImage(null)}
          alt="Print media clipping"
          downloadUrl={selectedImage}
        />
      ) : null}
    </div>
  );
}
