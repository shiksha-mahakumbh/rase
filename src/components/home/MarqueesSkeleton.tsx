/** Static announcements strip — matches Marquees layout to prevent CLS before hydration. */
export default function MarqueesSkeleton() {
  return (
    <section
      className="border-y border-primary/10 bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm"
      aria-label="Announcements"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-saffron/60" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary md:text-base">
              Announcements
            </h2>
          </div>
          <span
            className="inline-flex min-h-[44px] items-center rounded-lg bg-primary/20 px-3 py-2 text-xs font-bold text-transparent"
            aria-hidden
          >
            Register Now
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-brand-saffron/20 bg-white/90 shadow-sm">
          <div className="flex gap-3 px-3 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="mx-1 inline-flex h-[34px] min-w-[9rem] shrink-0 items-center rounded-full border border-primary/10 bg-slate-100/80 px-4"
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
