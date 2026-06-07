import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  title: string;
  date: string;
  venue: string;
  description: string;
  imageSrc?: string;
  href: string;
  ctaLabel?: string;
  badge?: string;
}

export default function EventCard({
  title,
  date,
  venue,
  description,
  imageSrc,
  href,
  ctaLabel = "Learn more",
  badge,
}: EventCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      {imageSrc && (
        <div className="relative h-40 w-full bg-slate-100 md:h-48">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {badge && (
          <span className="mb-2 w-fit rounded-full bg-brand-saffron/15 px-2.5 py-0.5 text-xs font-bold text-brand-saffron">
            {badge}
          </span>
        )}
        <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-emerald">{date}</p>
        <p className="text-sm text-slate-500">{venue}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
        <Link
          href={href}
          className="mt-4 inline-flex min-h-[44px] items-center text-sm font-bold text-brand-navy hover:text-brand-saffron"
        >
          {ctaLabel} →
        </Link>
      </div>
    </article>
  );
}
