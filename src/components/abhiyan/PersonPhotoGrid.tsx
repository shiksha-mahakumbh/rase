import Image from "next/image";

type PersonWithPhoto = {
  name: string;
  role: string;
  organization?: string;
  imageSrc?: string;
};

export default function PersonPhotoGrid({
  items,
  columns = 2,
}: {
  items: PersonWithPhoto[];
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <ul className={`grid gap-3 ${colClass}`}>
      {items.map((p) => (
        <li
          key={`${p.name}-${p.role}`}
          className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm"
        >
          {p.imageSrc ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-brand-saffron/30 bg-slate-100">
              <Image
                src={p.imageSrc}
                alt={p.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : null}
          <div className="min-w-0">
            <p className="font-semibold text-brand-navy">{p.name}</p>
            <p className="text-slate-600">
              {[p.role, p.organization].filter(Boolean).join(" · ")}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
