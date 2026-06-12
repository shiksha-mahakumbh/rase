"use client";

import Image from "next/image";
import { useCms } from "@/lib/cms/context";
import { getSection, sectionField, sectionItems } from "@/lib/cms/utils";

const DEFAULT_LOGOS = [
  { src: "/logo.png", alt: "Department of Holistic Education", href: "https://www.dhe.org.in/" },
  { src: "/vidyabharti.png", alt: "Vidya Bharati", href: "https://vidyabharti.net/" },
  { src: "/shiksha.png", alt: "Shiksha Mahakumbh", href: "https://www.shikshamahakumbh.com/" },
  { src: "/sLogo.png", alt: "RASE", href: "https://www.rase.co.in/" },
];

export default function TrustStrip() {
  const cms = useCms();
  const stats = getSection(cms?.homepage, "stats");
  const partners = getSection(cms?.homepage, "partners");

  const cmsLogos = sectionItems<{ src?: string; logoUrl?: string; alt?: string; name?: string; href?: string; website?: string }>(
    stats,
    "logos"
  );
  const partnerLogos = sectionItems<{ logoUrl: string; name: string; website?: string }>(partners);

  const logos =
    cmsLogos.length > 0
      ? cmsLogos.map((l) => ({
          src: l.src ?? l.logoUrl ?? "/logo.png",
          alt: l.alt ?? l.name ?? "Partner",
          href: l.href ?? l.website ?? "#",
        }))
      : partnerLogos.length > 0
        ? partnerLogos.slice(0, 4).map((p) => ({
            src: p.logoUrl,
            alt: p.name,
            href: p.website ?? "#",
          }))
        : DEFAULT_LOGOS;

  const tagline = sectionField(
    stats,
    "tagline",
    "An initiative of DHE · In collaboration with INIs & national partners"
  );

  return (
    <section
      aria-label="Organizing partners"
      className="border-y border-slate-200 bg-white py-6"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          {tagline}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <a
              key={logo.alt}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-saffron"
              aria-label={logo.alt}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={48}
                loading="lazy"
                className="h-10 w-auto object-contain md:h-12"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
