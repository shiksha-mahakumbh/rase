import Image from "next/image";

interface SpeakerCardProps {
  name: string;
  role: string;
  imageSrc?: string;
}

export default function SpeakerCard({ name, role, imageSrc }: SpeakerCardProps) {
  return (
    <article className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm md:p-5">
      <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full bg-brand-navy/10 md:h-24 md:w-24">
        {imageSrc ? (
          <Image src={imageSrc} alt={`Portrait of ${name}`} fill className="object-cover object-top" sizes="96px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-brand-navy/40">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="text-sm font-bold text-brand-navy md:text-base">{name}</h3>
      <p className="mt-1 text-xs leading-snug text-slate-500 md:text-sm">{role}</p>
    </article>
  );
}
