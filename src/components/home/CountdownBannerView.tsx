import { event } from "@/design/tokens";
import { getCountdownSnapshot } from "@/lib/home/countdown";

const DEFAULT_UNITS = [
  { label: "Days", key: "days" as const },
  { label: "Hours", key: "hours" as const },
  { label: "Min", key: "minutes" as const },
  { label: "Sec", key: "seconds" as const },
];

type CountdownLabels = {
  label: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

export default function CountdownBannerView({
  theme = "dark",
  labels,
}: {
  theme?: "dark" | "light";
  labels?: CountdownLabels;
}) {
  const left = getCountdownSnapshot();
  if (left.ended) return null;

  const isLight = theme === "light";
  const units = DEFAULT_UNITS.map((u) => ({
    ...u,
    label: labels?.[u.key] ?? u.label,
  }));

  return (
    <div
      className={
        isLight
          ? "flex flex-wrap items-center justify-center gap-3 rounded-xl border border-brand-saffron/30 bg-white px-4 py-3 shadow-sm lg:justify-start"
          : "flex flex-wrap items-center justify-center gap-3 rounded-xl border border-white/20 bg-black/20 px-4 py-3"
      }
      role="timer"
      aria-label={`Countdown to ${event.name}`}
    >
      <span
        className={
          isLight
            ? "text-xs font-bold uppercase tracking-wider text-brand-saffron-dark"
            : "text-xs font-bold uppercase tracking-wider text-brand-saffron"
        }
      >
        {labels?.label ?? "Event begins in"}
      </span>
      <div className="flex gap-2">
        {units.map((u) => (
          <div
            key={u.label}
            className={
              isLight
                ? "min-w-[3rem] rounded-lg border border-brand-blue/10 bg-brand-surface-warm px-2 py-1 text-center"
                : "min-w-[3rem] rounded-lg bg-white/10 px-2 py-1 text-center"
            }
          >
            <span
              className={
                isLight
                  ? "block text-lg font-extrabold text-brand-navy tabular-nums"
                  : "block text-lg font-extrabold text-white tabular-nums"
              }
            >
              {String(left[u.key]).padStart(2, "0")}
            </span>
            <span
              className={
                isLight ? "text-[10px] uppercase text-slate-500" : "text-[10px] uppercase text-white/70"
              }
            >
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
