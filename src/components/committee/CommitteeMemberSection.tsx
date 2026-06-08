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

      <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 md:block">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="bg-gradient-to-r from-brand-navy to-brand-navy-light text-white">
              <th scope="col" className="px-5 py-3.5 text-sm font-semibold">
                Name
              </th>
              <th scope="col" className="px-5 py-3.5 text-sm font-semibold">
                Designation
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={`${member.name}-${index}`}
                className="border-t border-slate-100 transition hover:bg-brand-surface-warm"
              >
                <td className="px-5 py-3.5 font-medium text-brand-navy">
                  {member.name}
                </td>
                <td className="px-5 py-3.5 text-gray-600">{member.designation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:hidden">
        {members.map((member, index) => (
          <article
            key={`${member.name}-card-${index}`}
            className="animate-fade-in rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <h3 className="font-bold text-brand-navy">{member.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">
              {member.designation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
