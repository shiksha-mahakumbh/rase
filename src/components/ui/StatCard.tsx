"use client";

import { ReactNode, useEffect, useState } from "react";

interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: ReactNode;
  className?: string;
  variant?: "dark" | "light";
}

export default function StatCard({
  value,
  label,
  suffix = "",
  prefix = "",
  icon,
  className = "",
  variant = "dark",
}: StatCardProps) {
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }
    setStarted(true);
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor(value * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, started]);

  const shell =
    variant === "light"
      ? "rounded-2xl border border-brand-saffron/20 bg-white p-4 shadow-md shadow-brand-saffron/5 md:p-5"
      : `rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm md:p-5 ${className}`;

  const valueClass =
    variant === "light" ? "text-2xl font-extrabold text-brand-navy md:text-3xl" : "text-2xl font-extrabold text-white md:text-3xl";

  const labelClass =
    variant === "light"
      ? "mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 md:text-sm"
      : "mt-1 text-xs font-medium uppercase tracking-wide text-white/80 md:text-sm";

  return (
    <div className={variant === "light" ? `${shell} ${className}` : shell}>
      {icon && (
        <div className="mb-2 text-brand-saffron" aria-hidden>
          {icon}
        </div>
      )}
      <p className={valueClass}>
        {prefix}
        {display.toLocaleString("en-IN")}
        {suffix}
      </p>
      <p className={labelClass}>
        {label}
      </p>
    </div>
  );
}
