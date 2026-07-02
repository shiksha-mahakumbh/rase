/**
 * Accommodation is not open for registration yet — shown on all registration forms.
 */
export default function AccommodationNotice() {
  return (
    <section
      className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-slate-700"
      aria-labelledby="accommodation-notice-heading"
    >
      <h3 id="accommodation-notice-heading" className="font-semibold text-brand-navy">
        Accommodation
      </h3>
      <p className="mt-2 leading-relaxed">
        Accommodation registration will open from the beginning of September. Further details
        will be shared soon.
      </p>
      <p className="mt-2 text-xs text-slate-600">
        You can complete your programme registration now; lodging booking will be announced
        separately on this page and by email.
      </p>
    </section>
  );
}
