import type { BestWishEntry } from "@/data/best-wishes";
import { formatWishScope } from "@/data/best-wishes";

type Props = {
  wish: BestWishEntry;
  variant?: "default" | "featured";
};

export default function WishCard({ wish, variant = "default" }: Props) {
  const isFeatured = variant === "featured";

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        isFeatured
          ? "border-brand-saffron/40 ring-1 ring-brand-saffron/20"
          : "border-slate-200 hover:border-brand-saffron/30"
      }`}
    >
      <div
        className={`h-1.5 w-full ${
          isFeatured
            ? "bg-gradient-to-r from-brand-saffron via-amber-400 to-brand-navy"
            : "bg-gradient-to-r from-brand-navy/80 to-brand-saffron/80"
        }`}
        aria-hidden
      />
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {isFeatured && (
          <span className="mb-2 inline-flex w-fit rounded-full bg-brand-saffron/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-navy">
            Featured
          </span>
        )}
        <h3 className="text-base font-bold leading-snug text-brand-navy md:text-lg">
          {wish.name}
        </h3>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-brand-saffron-dark">
          {wish.designation}
        </p>
        <blockquote className="mt-4 flex-1 border-l-[3px] border-brand-saffron/50 pl-3 text-sm italic leading-relaxed text-slate-700">
          &ldquo;{wish.message}&rdquo;
        </blockquote>
        <footer className="mt-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <span>{formatWishScope(wish)}</span>
          <span>{wish.year}</span>
        </footer>
      </div>
    </article>
  );
}
