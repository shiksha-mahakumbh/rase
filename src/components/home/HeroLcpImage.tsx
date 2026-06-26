const BRAND_HERO_PNG = "/branding/shiksha-mahakumbh-brand-hero.png";
const BRAND_HERO_WEBP_640 = "/branding/shiksha-mahakumbh-brand-hero-640.webp";
const BRAND_HERO_WEBP_768 = "/branding/shiksha-mahakumbh-brand-hero-768.webp";

export const HERO_LCP_PRELOAD = BRAND_HERO_WEBP_640;

type HeroLcpImageProps = {
  alt: string;
  src?: string;
  className?: string;
};

/** Native LCP image — avoids Next/Image hydration delay on the hero. */
export default function HeroLcpImage({
  alt,
  src = BRAND_HERO_PNG,
  className = "",
}: HeroLcpImageProps) {
  const isBrandHero = src === BRAND_HERO_PNG || src.endsWith("shiksha-mahakumbh-brand-hero.png");

  if (isBrandHero) {
    return (
      <picture className={`block aspect-[1024/534] ${className}`}>
        <source
          type="image/webp"
          srcSet={`${BRAND_HERO_WEBP_640} 640w, ${BRAND_HERO_WEBP_768} 768w`}
          sizes="(max-width: 1024px) 100vw, 560px"
        />
        <img
          src={BRAND_HERO_PNG}
          alt={alt}
          width={1024}
          height={534}
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover"
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
      decoding="async"
      fetchPriority="high"
      className={className}
    />
  );
}
