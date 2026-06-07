import React from "react";
import Image from "next/image";

interface GuestProps {
  name: string;
  place: string;
  designation: string;
  imageSrc: string;
  href?: string;
}

const Guest: React.FC<GuestProps> = ({
  name,
  place,
  designation,
  imageSrc,
  href,
}) => (
  <article className="mx-auto flex h-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_32px_rgba(11,31,59,0.08)] transition hover:-translate-y-1 hover:border-brand-saffron/30 hover:shadow-lg">
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-surface">
      <Image
        alt={`Portrait of ${name}`}
        src={imageSrc}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 320px"
        loading="lazy"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent"
      />
    </div>
    <div className="flex flex-1 flex-col p-5">
      {href ? (
        <a
          href={href}
          className="text-lg font-bold text-brand-navy hover:text-brand-saffron-dark hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </a>
      ) : (
        <h3 className="text-lg font-bold text-brand-navy">{name}</h3>
      )}
      <p className="mt-1 text-sm font-medium text-brand-saffron-dark">
        {designation}
      </p>
      <blockquote className="mt-3 flex-1 border-l-2 border-brand-saffron/50 pl-3 text-sm italic leading-relaxed text-gray-700">
        {place}
      </blockquote>
    </div>
  </article>
);

export default Guest;
