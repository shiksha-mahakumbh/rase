"use client";

export interface CommitteeMember {
  id?: number;
  name: string;
  designation: string;
  photo?: string;
}

interface CommitteeMemberSectionProps {
  title: string;
  members: CommitteeMember[];
  badge?: string;
}

export default function CommitteeMemberSection({
  title,
  members,
  badge,
}: CommitteeMemberSectionProps) {
  const sectionId = `section-${title.replace(/\s/g, "-")}`;

  return (
    <section className="mb-10" aria-labelledby={sectionId}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h2 id={sectionId} className="text-xl font-bold text-brand-navy md:text-2xl">
          {title}
        </h2>
        {badge && (
          <span className="rounded-full bg-brand-saffron/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-saffron-dark">
            {badge}
          </span>
        )}
        <span className="text-sm text-gray-500">{members.length} members</span>
      </div>

      <div className="grid gap-3 print:grid-cols-2 print:gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member, index) => (
          <article
            key={`${member.name}-card-${index}`}
            className="animate-fade-in rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-brand-saffron/30 hover:shadow-md print:rounded-none print:p-2 print:shadow-none"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <h3 className="font-bold text-brand-navy">{member.name}</h3>
            {member.designation ? (
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{member.designation}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
