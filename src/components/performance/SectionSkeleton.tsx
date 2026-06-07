export default function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div
      className="animate-pulse rounded-2xl border border-slate-100 bg-white/60 p-6"
      aria-hidden="true"
    >
      <div className="mb-4 h-4 w-32 rounded bg-slate-200" />
      <div className="mb-2 h-8 w-2/3 max-w-md rounded bg-slate-200" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="mb-2 h-3 rounded bg-slate-100"
          style={{ width: `${85 - i * 12}%` }}
        />
      ))}
    </div>
  );
}
