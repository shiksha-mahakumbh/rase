"use client";

import Image, { type ImageProps } from "next/image";

/** Tiny neutral blur for static assets */
const DEFAULT_BLUR =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 6'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='8' height='6' fill='%23e2e8f0' filter='url(%23b)'/%3E%3C/svg%3E";

type OptimizedImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
  enableBlur?: boolean;
};

/**
 * Standardized next/image wrapper: responsive sizes, lazy load, optional blur.
 */
export default function OptimizedImage({
  alt,
  sizes,
  loading,
  priority,
  enableBlur = true,
  placeholder,
  ...rest
}: OptimizedImageProps) {
  const isStatic =
    typeof rest.src === "string" &&
    (rest.src.startsWith("/") || rest.src.startsWith("data:"));

  return (
    <Image
      alt={alt}
      sizes={
        sizes ??
        "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      }
      loading={priority ? undefined : loading ?? "lazy"}
      placeholder={
        placeholder ??
        (enableBlur && isStatic ? "blur" : undefined)
      }
      blurDataURL={
        rest.blurDataURL ??
        (enableBlur && isStatic ? DEFAULT_BLUR : undefined)
      }
      priority={priority}
      {...rest}
    />
  );
}
