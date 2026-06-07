"use client";

import { impactStatistics } from "@/data/authority";
import { SectionHeader, StatCard } from "@/components/ui";

interface Props {
  variant?: "default" | "compact";
  className?: string;
}

export default function ImpactStatisticsSection({
  variant = "default",
  className = "",
}: Props) {
  const compact = variant === "compact";

  return (
    <section
      aria-label="Impact statistics"
      className={`${compact ? "py-8" : "py-12 md:py-16"} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="National footprint"
          title="Impact at a Glance"
          description="Measurable reach across editions, institutions, and participants."
          align={compact ? "left" : "center"}
        />
        <div
          className={`mt-8 grid gap-4 ${
            compact
              ? "grid-cols-2 sm:grid-cols-3"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          }`}
        >
          {impactStatistics.map((stat) => (
            <div
              key={stat.label}
              className={
                compact
                  ? "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  : "rounded-2xl bg-brand-navy p-1"
              }
            >
              {compact ? (
                <>
                  <p className="text-2xl font-bold text-brand-navy">
                    {stat.prefix}
                    {stat.value.toLocaleString("en-IN")}
                    {stat.suffix}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {stat.label}
                  </p>
                </>
              ) : (
                <StatCard
                  value={stat.value}
                  label={stat.label}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
