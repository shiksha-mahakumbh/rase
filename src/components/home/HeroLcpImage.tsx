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
      <picture className={`block h-full w-full ${className}`}>
        <source
          type="image/webp"
          srcSet={`${BRAND_HERO_WEBP_640} 640w, ${BRAND_HERO_WEBP_768} 768w`}
          sizes="(max-width: 1024px) 100vw, 560px"
        />
        <img
          src={BRAND_HERO_WEBP_640}
          alt={alt}
          width={1024}
          height={534}
          sizes="(max-width: 1024px) 100vw, 560px"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="h-full w-full object-contain object-center"
        />
      </picture>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={1024}
      height={534}
      loading="eager"
      decoding="sync"
      fetchPriority="high"
      className={className}
    />
  );
}
