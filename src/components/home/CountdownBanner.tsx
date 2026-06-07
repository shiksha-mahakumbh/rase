"use client";

import { useEffect, useState } from "react";
import { event } from "@/design/tokens";

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, ended: false };
}

export default function CountdownBanner() {
  const target = new Date(`${event.startDate}T09:00:00`);
  const [left, setLeft] = useState(getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left.ended) return null;

  const units = [
    { label: "Days", value: left.days },
    { label: "Hours", value: left.hours },
    { label: "Min", value: left.minutes },
    { label: "Sec", value: left.seconds },
  ];

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 py-3"
      role="timer"
      aria-live="polite"
      aria-label={`Countdown to ${event.name}`}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-brand-saffron">
        Event begins in
      </span>
      <div className="flex gap-2">
        {units.map((u) => (
          <div
            key={u.label}
            className="min-w-[3rem] rounded-lg bg-white/10 px-2 py-1 text-center"
          >
            <span className="block text-lg font-extrabold text-white tabular-nums">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase text-white/70">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
