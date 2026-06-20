import type { AbhiyanSpeaker } from "@/data/mahakumbh-abhiyan-speakers";

type EditionSpeakersListProps = {
  speakers: AbhiyanSpeaker[];
  edition: string;
  max?: number;
};

export default function EditionSpeakersList({
  speakers,
  edition,
  max = 6,
}: EditionSpeakersListProps) {
  if (speakers.length === 0) return null;

  const shown = speakers.slice(0, max);
  const remaining = speakers.length - shown.length;

  return (
    <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm font-semibold text-brand-navy">वक्ता एवं गरिमामयी विभाग</p>
      <ul className="mt-3 space-y-2">
        {shown.map((speaker) => {
          const detail = [speaker.role, speaker.organization].filter(Boolean).join(" · ");
          return (
            <li key={`${edition}-${speaker.name}`} className="text-sm leading-snug">
              <span className="font-semibold text-brand-navy">{speaker.name}</span>
              {detail ? (
                <span className="block text-xs text-slate-600">{detail}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
      {remaining > 0 ? (
        <p className="mt-2 text-xs font-medium text-brand-saffron">
          + {remaining} और वक्ता
        </p>
      ) : null}
    </div>
  );
}
