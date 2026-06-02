/**
 * Ensures static public paths work with next/image:
 * - adds leading slash for relative paths
 * - encodes spaces and other characters for valid URL construction
 */
export function normalizeStaticImageSrc(src: string): string {
  if (!src) return src;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  const path = src.startsWith("/") ? src : `/${src}`;
  return encodeURI(path);
}
