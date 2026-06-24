import Image from "next/image";
import Link from "next/link";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";
import type { TrustStripContent } from "@/lib/home/build-home-sections";

function LogoTile({ logo }: { logo: TrustStripContent["logos"][number] }) {
  const safeHref = sanitizeExternalUrl(logo.href);
  const image = (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={80}
      height={40}
      sizes="80px"
      loading="lazy"
      unoptimized
      className="h-10 w-20 object-contain md:h-12 md:w-24"
    />
  );

  if (!safeHref) {
    return <div className="opacity-80">{image}</div>;
  }

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      className="opacity-80 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
      aria-label={logo.alt}
    >
      {image}
    </a>
  );
}

export default function TrustStrip({ content }: { content: TrustStripContent }) {
  const { tagline, logos } = content;

  return (
    <section
      aria-label="Organizing partners"
      className="border-y border-brand-saffron/15 bg-gradient-to-r from-brand-surface-warm via-white to-brand-surface-warm py-6"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          {tagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <LogoTile key={`${logo.src}-${logo.alt}`} logo={logo} />
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          <Link
            href="#conference-support"
            className="font-semibold text-brand-navy underline decoration-brand-saffron/40 underline-offset-2 hover:text-primary"
          >
            View all academic, media &amp; sponsor affiliations (SMK 1.0–6.0)
          </Link>
        </p>
      </div>
    </section>
  );
}
