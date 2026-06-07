/**
 * CLS-safe reserved region for future Google AdSense placements.
 * Min-height prevents layout shift when ads load.
 */
export default function AdSlotRegion({
  label = "Sponsored",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="complementary"
      aria-label={`Advertisement region: ${label}`}
      className={`mx-auto my-8 flex min-h-[90px] max-w-5xl items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 ${className}`}
    >
      <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </span>
    </div>
  );
}
