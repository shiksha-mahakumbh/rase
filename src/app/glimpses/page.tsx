import { redirect } from "next/navigation";

/** Legacy media glimpses → unified gallery (Phase 5) */
export default function GlimpsesRedirectPage() {
  redirect("/gallery");
}
