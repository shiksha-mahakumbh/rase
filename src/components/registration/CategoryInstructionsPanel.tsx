"use client";

import { RegistrationType } from "@/types/registration";
import { getCategoryMeta } from "@/lib/registration/categoryMeta";

export default function CategoryInstructionsPanel({
  registrationType,
}: {
  registrationType: RegistrationType;
}) {
  const meta = getCategoryMeta(registrationType);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-4">
        <div className="rounded-2xl border border-primary/10 bg-white/90 p-5 shadow-lg">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
            {registrationType}
          </h3>
          <p className="text-sm text-gray-700">{meta.description}</p>
        </div>

        <MetaSection title="Instructions" items={meta.instructions} />
        <MetaSection title="Eligibility" items={meta.eligibility} />
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm">
          <p className="font-bold text-brand-navy">Fee</p>
          <p className="mt-1 text-gray-800">{meta.fee}</p>
        </div>
        <MetaSection title="Documents Required" items={meta.documentsRequired} />
        <MetaSection title="Important Notes" items={meta.importantNotes} />
      </div>
    </aside>
  );
}

function MetaSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm">
      <p className="font-bold text-brand-navy">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-gray-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
