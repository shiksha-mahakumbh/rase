import type { ReactNode } from "react";

export type HubStat = {
  label: string;
  value: string;
  hint: string;
};

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  stats: readonly HubStat[];
  footer?: ReactNode;
};

export default function HubGradientBanner({ id, eyebrow, title, subtitle, stats, footer }: Props) {
  return (
    <section
      aria-labelledby={id}
      className="relative overflow-hidden rounded-2xl border border-brand-saffron/25 bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy p-5 text-white shadow-xl md:rounded-3xl md:p-8"
    >
      <div
        className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-brand-saffron/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-saffron md:text-xs">
        {eyebrow}
      </p>
      <h2 id={id} className="mt-2 text-xl font-bold md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
        {subtitle}
      </p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
              {stat.label}
            </dt>
            <dd className="mt-1 text-lg font-bold text-brand-saffron md:text-xl">{stat.value}</dd>
            <dd className="text-[11px] text-white/75">{stat.hint}</dd>
          </div>
        ))}
      </dl>
      {footer ? <div className="mt-5">{footer}</div> : null}
    </section>
  );
}
