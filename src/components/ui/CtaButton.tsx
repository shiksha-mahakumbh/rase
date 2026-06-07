import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

interface CtaButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
  external?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-saffron text-brand-navy hover:bg-brand-saffron-dark hover:text-white shadow-lg shadow-brand-saffron/25",
  secondary:
    "bg-brand-navy text-white hover:bg-brand-navy-light shadow-lg shadow-brand-navy/20",
  outline:
    "border-2 border-white/80 text-white hover:bg-white/10",
  ghost:
    "border-2 border-brand-navy/20 text-brand-navy hover:bg-brand-navy/5",
};

export default function CtaButton({
  href,
  children,
  variant = "primary",
  icon,
  className = "",
  external,
}: CtaButtonProps) {
  const base =
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron md:text-base";

  const classNames = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={classNames} target="_blank" rel="noopener noreferrer">
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classNames}>
      {icon}
      {children}
    </Link>
  );
}
