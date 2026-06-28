import {
  HERO_LCP_PRELOAD_640,
  HERO_LCP_PRELOAD_768,
} from "@/components/home/HeroLcpImage";

/** Responsive LCP preloads — must match picture srcSet breakpoints. */
export default function HeroLcpPreload() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href={HERO_LCP_PRELOAD_640}
        type="image/webp"
        media="(max-width: 640px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={HERO_LCP_PRELOAD_768}
        type="image/webp"
        media="(min-width: 641px)"
        fetchPriority="high"
      />
    </>
  );
}
