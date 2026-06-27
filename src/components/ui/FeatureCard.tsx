import Link from "next/link";
import { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  badge?: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  href,
  badge,
}: FeatureCardProps) {
  const className =
    "group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-saffron/30 hover:shadow-lg md:p-6";

  const inner = (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy transition-colors group-hover:bg-brand-saffron/15 group-hover:text-brand-saffron"
          aria-hidden
        >
          {icon}
        </div>
        {badge && (
          <span className="rounded-full bg-brand-emerald/10 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-saffron">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <article className={className}>{inner}</article>;
}
