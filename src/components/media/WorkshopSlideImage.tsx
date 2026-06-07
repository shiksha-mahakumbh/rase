"use client";

import OptimizedImage from "./OptimizedImage";

type WorkshopSlideImageProps = {
  src: string;
  alt: string;
};

/** Fixed-height workshop slider slide (replaces raw &lt;img&gt; for LCP/CLS). */
export default function WorkshopSlideImage({ src, alt }: WorkshopSlideImageProps) {
  return (
    <div className="relative mx-auto h-80 w-full max-w-2xl">
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="rounded-lg object-contain"
        sizes="(max-width: 768px) 100vw, 672px"
      />
    </div>
  );
}
