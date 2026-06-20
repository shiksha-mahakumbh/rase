/** Shared Tailwind class strings for registration forms — brand system */
export const formClasses = {
  page: "min-h-screen bg-white",
  shell:
    "mx-auto w-full max-w-4xl rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg md:p-10",
  title:
    "mb-2 text-center text-3xl font-extrabold tracking-tight text-brand-navy md:text-4xl",
  subtitle: "mb-8 text-center text-sm text-slate-600 md:text-base",
  label: "mb-1 block text-sm font-semibold text-slate-700",
  required: "text-red-600",
  input:
    "mt-1 block w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20",
  select:
    "mt-1 block w-full min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20",
  textarea:
    "mt-1 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20",
  fieldGroup: "mb-5",
  section:
    "mb-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6",
  sectionTitle:
    "mb-4 flex items-center gap-2 text-lg font-bold text-brand-navy",
  submitBtn:
    "w-full min-h-[48px] rounded-xl bg-brand-saffron font-bold text-brand-navy shadow-lg transition hover:bg-brand-saffron-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60",
  secondaryBtn:
    "mt-4 w-full min-h-[44px] rounded-xl border-2 border-brand-navy bg-white px-4 py-2 font-semibold text-brand-navy shadow-sm transition hover:bg-brand-navy hover:text-white",
  inlineSubmitBtn:
    "rounded-xl bg-brand-saffron px-4 py-2 font-bold text-brand-navy shadow-md transition hover:bg-brand-saffron-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60",
  trustBadge:
    "inline-flex items-center gap-1.5 rounded-full border border-brand-navy/15 bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-navy",
  notice:
    "rounded-xl border border-amber-200/60 bg-amber-50/80 p-4 text-sm text-amber-900",
  comingSoon:
    "rounded-2xl bg-gradient-to-r from-brand-navy to-brand-navy-light px-6 py-4 text-center text-lg font-semibold text-white shadow-lg",
} as const;
