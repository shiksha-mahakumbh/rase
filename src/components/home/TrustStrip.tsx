import Image from "next/image";

const logos = [
  { src: "/logo.png", alt: "Department of Holistic Education", href: "https://www.dhe.org.in/" },
  { src: "/vidyabharti.png", alt: "Vidya Bharati", href: "https://vidyabharti.net/" },
  { src: "/shiksha.png", alt: "Shiksha Mahakumbh", href: "https://www.rase.co.in/" },
  { src: "/sLogo.png", alt: "RASE", href: "https://www.rase.co.in/" },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Organizing partners"
      className="border-y border-slate-200 bg-white py-6"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          An initiative of DHE · In collaboration with INIs &amp; national partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <a
              key={logo.alt}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition hover:opacity-100"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={48}
                className="h-10 w-auto object-contain md:h-12"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
