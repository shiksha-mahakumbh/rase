import { BRAND_LOGO_SRC, BRAND_ORG_NAME_HI } from "@/constants/branding";

type BrandLogoMarkProps = {
  className?: string;
};

/** Original logo artwork — shape preserved; brand gradient applied via CSS mask. */
export default function BrandLogoMark({ className = "h-full w-full" }: BrandLogoMarkProps) {
  return (
    <div
      className={className}
      role="img"
      aria-label={BRAND_ORG_NAME_HI}
      style={{
        WebkitMaskImage: `url(${BRAND_LOGO_SRC})`,
        maskImage: `url(${BRAND_LOGO_SRC})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        background: "linear-gradient(145deg, #1a56db 0%, #0b1f3b 48%, #ff9933 100%)",
      }}
    />
  );
}
