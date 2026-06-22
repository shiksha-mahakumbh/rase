import Link from "next/link";
import { BRAND_DEPT_NAME_HI, BRAND_ORG_NAME_HI } from "@/constants/branding";
import BrandLogoMark from "./BrandLogoMark";

type NavBrandBlockProps = {
  compact?: boolean;
};

export default function NavBrandBlock({ compact = false }: NavBrandBlockProps) {
  return (
    <Link
      href="/"
      className="group flex min-w-0 shrink items-center gap-2 sm:gap-2.5"
      aria-label={`${BRAND_ORG_NAME_HI} — Home`}
    >
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-brand-saffron/35 bg-white p-1 shadow-sm transition-all duration-300 group-hover:border-brand-saffron/65 group-hover:shadow-md ${
          compact ? "h-10 w-9" : "h-11 w-10 sm:h-12 sm:w-11"
        }`}
      >
        <BrandLogoMark className="h-full w-full" />
      </div>
      <div className="hidden min-w-0 sm:block">
        <p
          className={`font-medium leading-tight text-brand-blue/85 ${
            compact ? "text-[8px] tracking-wide" : "text-[9px] tracking-wide sm:text-[10px]"
          }`}
        >
          {BRAND_DEPT_NAME_HI}
        </p>
        <p
          className={`font-extrabold leading-tight transition-all ${
            compact ? "text-sm" : "text-base sm:text-lg"
          }`}
        >
          <span className="text-brand-blue">शिक्षा </span>
          <span className="text-brand-saffron">महाकुंभ </span>
          <span className="text-brand-navy">अभियान</span>
        </p>
      </div>
    </Link>
  );
}
