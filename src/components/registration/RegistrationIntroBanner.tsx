import Link from "next/link";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

export default function RegistrationIntroBanner() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-4 md:px-8">
      <div className="rounded-2xl border border-brand-saffron/30 bg-gradient-to-br from-brand-saffron/5 to-white p-4 md:p-5">
        <p className="text-sm font-bold text-brand-navy">
          Recommended path: Delegate Registration
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Most faculty, students, and institutional participants register as delegates
          (₹0 for students · up to ₹5100 for industry). Programme tracks such as
          Conclave, Awards, and Olympiad use separate free or paid forms below.
        </p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link
            href={`${CANONICAL_ROUTES.downloads}#edition-brochures`}
            className="font-semibold text-brand-saffron underline decoration-brand-saffron/40"
          >
            Download edition brochures
          </Link>
          <Link
            href="/dashboard"
            className="font-semibold text-brand-navy underline decoration-brand-saffron/40"
          >
            Already registered? My portal
          </Link>
          <Link
            href="/refund-policy"
            className="font-semibold text-brand-navy underline decoration-brand-saffron/40"
          >
            Refund policy
          </Link>
        </p>
      </div>
    </div>
  );
}
