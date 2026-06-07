"use client";

import { ReactNode, useEffect, useState } from "react";

interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: ReactNode;
  className?: string;
}

export default function StatCard({
  value,
  label,
  suffix = "",
  prefix = "",
  icon,
  className = "",
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

  return (
    <div
      className={`rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm md:p-5 ${className}`}
    >
      {icon && (
        <div className="mb-2 text-brand-saffron" aria-hidden>
          {icon}
        </div>
      )}
      <p className="text-2xl font-extrabold text-white md:text-3xl">
        {prefix}
        {display.toLocaleString("en-IN")}
        {suffix}
      </p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-white/80 md:text-sm">
        {label}
      </p>
    </div>
  );
}
