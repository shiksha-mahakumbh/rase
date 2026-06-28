const BRAND_HERO_PNG = "/branding/shiksha-mahakumbh-brand-hero.png";
export const BRAND_HERO_WEBP_640 = "/branding/shiksha-mahakumbh-brand-hero-640.webp";
export const BRAND_HERO_WEBP_768 = "/branding/shiksha-mahakumbh-brand-hero-768.webp";

/** @deprecated use HERO_LCP_PRELOAD_640 */
export const HERO_LCP_PRELOAD = BRAND_HERO_WEBP_640;
export const HERO_LCP_PRELOAD_640 = BRAND_HERO_WEBP_640;
export const HERO_LCP_PRELOAD_768 = BRAND_HERO_WEBP_768;

type HeroLcpImageProps = {
  alt: string;
  src?: string;
  className?: string;
};

/** Native LCP image — direct WebP src avoids PNG→WebP upgrade delay. */
export default function HeroLcpImage({
  alt,
  src = BRAND_HERO_PNG,
  className = "",
}: HeroLcpImageProps) {
  const isBrandHero = src === BRAND_HERO_PNG || src.endsWith("shiksha-mahakumbh-brand-hero.png");

  if (isBrandHero) {
    return (
      <img
        src={BRAND_HERO_WEBP_640}
        srcSet={`${BRAND_HERO_WEBP_640} 640w, ${BRAND_HERO_WEBP_768} 768w`}
        sizes="(max-width: 1024px) 100vw, 560px"
        alt={alt}
        width={1024}
        height={534}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className={`h-full w-full object-contain object-center ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={1024}
      height={534}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      className={className}
    />
  );
}
