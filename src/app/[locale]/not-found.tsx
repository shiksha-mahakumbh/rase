import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-brand-navy">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        This localized page is not available.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white"
      >
        Home
      </Link>
    </div>
  );
}
