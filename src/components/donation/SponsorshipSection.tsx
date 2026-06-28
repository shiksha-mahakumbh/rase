import Link from "next/link";
import {
  SPONSORSHIP_ADDONS,
  SPONSORSHIP_BANK,
  SPONSORSHIP_PAGE_INTRO,
  SPONSORSHIP_TIERS,
  formatInr,
  formatInrLakhs,
  type SponsorshipTier,
  type SponsorshipTierId,
} from "@/data/sponsorship-hub";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

type Props = {
  selectedTierId: SponsorshipTierId | "custom";
  onSelectTier: (id: SponsorshipTierId) => void;
};

function TierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: SponsorshipTier;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={`rounded-2xl border p-4 transition ${
        selected
          ? "border-brand-saffron bg-brand-saffron/10 shadow-md ring-2 ring-brand-saffron/40"
          : "border-slate-200 bg-white hover:border-brand-saffron/40"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wide text-brand-saffron">
            {tier.badge}
          </span>
          <h3 className="mt-1 font-bold text-brand-navy">{tier.name}</h3>
          <p className="text-lg font-bold text-brand-blue">{formatInrLakhs(tier.amount)}</p>
        </div>
        {tier.freeDelegates != null ? (
          <p className="rounded-full bg-brand-surface px-2.5 py-1 text-[11px] font-semibold text-brand-navy">
            {tier.freeDelegates} delegate{tier.freeDelegates === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{tier.description}</p>
      <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
        {tier.highlights.slice(0, 4).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-brand-saffron" aria-hidden>
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
        {tier.highlights.length > 4 ? (
          <li className="text-slate-500">+ {tier.highlights.length - 4} more benefits</li>
        ) : null}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {tier.contactOnly ? (
          <Link
            href={CANONICAL_ROUTES.departments.vitt}
            className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-xl border border-brand-navy/20 px-4 py-2 text-xs font-bold text-brand-navy transition hover:bg-brand-navy/5"
          >
            Enquire — Vitt Vibhag
          </Link>
        ) : (
          <button
            type="button"
            onClick={onSelect}
            className={`inline-flex min-h-[40px] flex-1 items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition ${
              selected
                ? "bg-brand-navy text-white"
                : "bg-brand-saffron text-brand-navy hover:bg-brand-saffron-dark hover:text-white"
            }`}
          >
            {selected ? "Selected" : "Select package"}
          </button>
        )}
      </div>
    </article>
  );
}

export default function SponsorshipSection({ selectedTierId, onSelectTier }: Props) {
  const selected = SPONSORSHIP_TIERS.find((t) => t.id === selectedTierId);

  return (
    <section id="sponsorship" aria-labelledby="sponsorship-title" className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand-saffron">
          {SPONSORSHIP_PAGE_INTRO.eyebrow}
        </p>
        <h2 id="sponsorship-title" className="mt-2 text-xl font-bold text-brand-navy md:text-2xl">
          {SPONSORSHIP_PAGE_INTRO.title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
          {SPONSORSHIP_PAGE_INTRO.subtitle}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[640px] w-full text-left text-sm">
          <caption className="sr-only">Main sponsorship categories and benefits summary</caption>
          <thead className="bg-brand-surface text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Amount</th>
              <th className="px-4 py-3 font-bold">Delegates</th>
              <th className="px-4 py-3 font-bold">Colour ad page</th>
              <th className="px-4 py-3 font-bold">Banner</th>
            </tr>
          </thead>
          <tbody>
            {SPONSORSHIP_TIERS.map((tier) => (
              <tr key={tier.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-brand-navy">{tier.name}</td>
                <td className="px-4 py-3">{formatInrLakhs(tier.amount)}</td>
                <td className="px-4 py-3">{tier.freeDelegates ?? "—"}</td>
                <td className="px-4 py-3">{tier.colourAdPages ?? "—"}</td>
                <td className="px-4 py-3">{tier.bannerAtSite ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SPONSORSHIP_TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            selected={selectedTierId === tier.id}
            onSelect={() => onSelectTier(tier.id)}
          />
        ))}
      </div>

      {selected && !selected.contactOnly ? (
        <div className="rounded-2xl border border-brand-blue/15 bg-brand-blue/5 p-5">
          <h3 className="font-bold text-brand-navy">{selected.name} — full benefits</h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {selected.highlights.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-slate-700">
                <span className="text-brand-saffron" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-brand-navy">Session sponsorship</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {SPONSORSHIP_ADDONS.session.map((item) => (
              <li key={item.name} className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                <span>{item.name}</span>
                <span className="shrink-0 font-semibold text-brand-navy">{formatInr(item.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-brand-navy">Souvenir advertisement</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {SPONSORSHIP_ADDONS.souvenir.map((item) => (
              <li key={item.name} className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                <span>{item.name}</span>
                <span className="shrink-0 font-semibold text-brand-navy">{formatInr(item.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-brand-navy">Exhibition stalls</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {SPONSORSHIP_ADDONS.exhibition.map((item) => (
              <li key={item.name} className="flex justify-between gap-3 border-b border-slate-100 pb-2">
                <span>{item.name}</span>
                <span className="shrink-0 font-semibold text-brand-navy">{formatInr(item.amount)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            For add-on packages,{" "}
            <Link href={CANONICAL_ROUTES.contact} className="font-semibold text-brand-blue hover:underline">
              contact the organising team
            </Link>{" "}
            or Vitt Vibhag.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-saffron/25 bg-brand-surface-warm p-5 text-sm text-slate-700">
        <h3 className="font-bold text-brand-navy">Bank transfer (sponsorship)</h3>
        <dl className="mt-3 grid gap-1 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-brand-navy">Account name</dt>
            <dd>{SPONSORSHIP_BANK.accountName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-brand-navy">Account no.</dt>
            <dd>{SPONSORSHIP_BANK.accountNumber}</dd>
          </div>
          <div>
            <dt className="font-semibold text-brand-navy">Bank / branch</dt>
            <dd>
              {SPONSORSHIP_BANK.bank}, {SPONSORSHIP_BANK.branch}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-brand-navy">IFSC / UPI</dt>
            <dd>
              {SPONSORSHIP_BANK.ifsc} · {SPONSORSHIP_BANK.upi}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
