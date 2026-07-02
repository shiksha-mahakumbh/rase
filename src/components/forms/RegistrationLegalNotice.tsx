import Link from "next/link";
import { ROUTES } from "@/constants/routes";

/** Shown above registration submit buttons — links to legal policies. */
export default function RegistrationLegalNotice() {
  return (
    <p className="text-sm leading-relaxed text-slate-600">
      By submitting you agree to our{" "}
      <Link href={ROUTES.privacy} className="font-semibold text-brand-navy underline">
        Privacy Policy
      </Link>
      ,{" "}
      <Link href={ROUTES.terms} className="font-semibold text-brand-navy underline">
        Terms &amp; Conditions
      </Link>
      , and{" "}
      <Link href={ROUTES.cookiePolicy} className="font-semibold text-brand-navy underline">
        Cookie Policy
      </Link>
      .
    </p>
  );
}
