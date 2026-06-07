interface TimelineCardProps {
  year: string;
  title: string;
  location: string;
  highlight: string;
  active?: boolean;
}

export default function TimelineCard({
  year,
  title,
  location,
  highlight,
  active,
}: TimelineCardProps) {
  return (
    <article
      className={`relative rounded-2xl border p-5 md:p-6 ${
        active
          ? "border-brand-saffron bg-gradient-to-br from-brand-navy to-brand-navy-light text-white shadow-xl"
          : "border-slate-200 bg-white shadow-sm"
      }`}
    >
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
          active ? "bg-brand-saffron text-brand-navy" : "bg-brand-navy/10 text-brand-navy"
        }`}
      >
        {year}
      </span>
      <h3
        className={`mt-3 text-lg font-bold ${active ? "text-white" : "text-brand-navy"}`}
      >
        {title}
      </h3>
      <p className={`mt-1 text-sm font-medium ${active ? "text-white/90" : "text-brand-saffron"}`}>
        {location}
      </p>
      <p className={`mt-2 text-sm leading-relaxed ${active ? "text-white/85" : "text-slate-600"}`}>
        {highlight}
      </p>
    </article>
  );
}
