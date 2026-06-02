/** Shared Tailwind class strings for registration forms — presentation only */
export const formClasses = {
  page:
    "min-h-screen bg-gradient-to-br from-slate-50 via-[#faf8f6] to-amber-50/40",
  shell:
    "mx-auto w-full max-w-4xl rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_20px_60px_rgba(80,42,42,0.1)] backdrop-blur-xl md:p-10",
  title: "home-section-title mb-2 text-center text-3xl md:text-4xl",
  subtitle: "mb-8 text-center text-sm text-gray-600 md:text-base",
  label: "mb-1 block text-sm font-semibold text-gray-700",
  required: "text-red-600",
  input:
    "mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
  select:
    "mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
  textarea:
    "mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
  fieldGroup: "mb-5",
  section:
    "mb-8 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#faf7f5] p-5 md:p-6",
  sectionTitle:
    "mb-4 flex items-center gap-2 text-lg font-bold text-primary",
  submitBtn:
    "w-full rounded-xl bg-gradient-to-r from-primary to-[#7a4343] px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60",
  trustBadge:
    "inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary",
  notice:
    "rounded-xl border border-amber-200/60 bg-amber-50/80 p-4 text-sm text-amber-900",
  comingSoon:
    "rounded-2xl bg-gradient-to-r from-primary to-[#7a4343] px-6 py-4 text-center text-lg font-semibold text-white shadow-lg",
} as const;
