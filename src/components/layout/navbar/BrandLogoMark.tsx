import Image from "next/image";
import { BRAND_LOGO_SRC, BRAND_ORG_NAME_HI } from "@/constants/branding";

type BrandLogoMarkProps = {
  className?: string;
};

/** Official Shiksha Mahakumbh Abhiyan logo artwork. */
export default function BrandLogoMark({ className = "h-full w-full" }: BrandLogoMarkProps) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt={BRAND_ORG_NAME_HI}
      width={44}
      height={44}
      className={`${className} object-contain`}
      priority
    />
  );
}
