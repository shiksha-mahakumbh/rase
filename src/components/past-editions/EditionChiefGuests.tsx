import { EDITION_CHIEF_GUESTS } from "@/data/abhiyan-photo-frame";

type Props = {
  edition: string;
  max?: number;
};

export default function EditionChiefGuests({ edition, max = 4 }: Props) {
  const guests = EDITION_CHIEF_GUESTS[edition] ?? [];
  if (guests.length === 0) return null;

  const shown = guests.slice(0, max);
  const remaining = guests.length - shown.length;

  return (
    <div className="mt-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-saffron">
        प्रमुख अतिथि
      </p>
      <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
        {shown.map((g) => (
          <li key={`${g.name}-${g.role}`}>
            <span className="font-medium text-brand-navy">{g.name}</span>
            <span className="text-slate-600">
              {" "}
              — {[g.role, g.organization].filter(Boolean).join(", ")}
            </span>
          </li>
        ))}
        {remaining > 0 ? (
          <li className="text-slate-500">+ {remaining} और अतिथि</li>
        ) : null}
      </ul>
    </div>
  );
}
