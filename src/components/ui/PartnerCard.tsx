import Image from "next/image";
import Link from "next/link";

interface PartnerCardProps {
  name: string;
  logoSrc: string;
  href?: string;
}

export default function PartnerCard({ name, logoSrc, href }: PartnerCardProps) {
  const inner = (
    <div className="flex h-20 items-center justify-center rounded-xl border border-slate-100 bg-white p-3 transition hover:border-brand-saffron/30 hover:shadow-md md:h-24">
      <Image
        src={logoSrc}
        alt={name}
        width={120}
        height={48}
        className="max-h-12 w-auto object-contain"
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </Link>
    );
  }

  return inner;
}
