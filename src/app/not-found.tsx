import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-brand-navy">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        The page you requested does not exist or has moved.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-navy-light"
        >
          Home
        </Link>
        <Link
          href="/registration"
          className="rounded-xl border border-brand-saffron px-5 py-2.5 text-sm font-bold text-brand-saffron"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
