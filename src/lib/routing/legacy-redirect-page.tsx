import { redirect } from "next/navigation";

/** Server-side fallback redirect when next.config redirect is bypassed in dev */
export function createLegacyRedirect(destination: string) {
  return function LegacyRedirectPage() {
    redirect(destination);
  };
}
