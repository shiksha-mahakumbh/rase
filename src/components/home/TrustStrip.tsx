"use client";

import Image from "next/image";
import Link from "next/link";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";
import { sanitizeExternalUrl } from "@/lib/security/safe-external-url";

/** Core organizing logos — full partner lists live in Conference Support (#conference-support). */
const ORGANIZING_LOGOS = [
  { src: "/logo.png", alt: "Department of Holistic Education", href: "https://www.dhe.org.in/" },
  { src: "/vidyabharti.png", alt: "Vidya Bharati", href: "https://www.vidyabharati.org/" },
  { src: "/shiksha.png", alt: "Shiksha Mahakumbh", href: "https://www.shikshamahakumbh.com/" },
  { src: "/sLogo.png", alt: "RASE", href: "https://www.rase.co.in/" },
] as const;

function dedupeLogos<T extends { src: string }>(logos: T[]): T[] {
  const seen = new Set<string>();
  return logos.filter((logo) => {
    if (seen.has(logo.src)) return false;
    seen.add(logo.src);
    return true;
  });
}

function LogoTile({ logo }: { logo: { src: string; alt: string; href: string } }) {
  const safeHref = sanitizeExternalUrl(logo.href);
  const image = (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={100}
      height={48}
      loading="lazy"
      className="h-10 w-auto object-contain md:h-12"
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

export default function TrustStrip() {
  const cms = useCms();
  const stats = getSection(cms?.homepage, "stats");

  const cmsLogos = sectionItems<{
    src?: string;
    logoUrl?: string;
    alt?: string;
    name?: string;
    href?: string;
    website?: string;
  }>(stats, "logos");

  const logos = dedupeLogos(
    cmsLogos.length > 0
      ? cmsLogos.slice(0, 4).map((l) => ({
          src: l.src ?? l.logoUrl ?? "/logo.png",
          alt: l.alt ?? l.name ?? "Partner",
          href: sanitizeExternalUrl(l.href ?? l.website) ?? "",
        }))
      : ORGANIZING_LOGOS.map((l) => ({ ...l }))
  );

  const tagline = sectionField(
    stats,
    "tagline",
    "An initiative of DHE · In collaboration with INIs & national partners"
  );

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
