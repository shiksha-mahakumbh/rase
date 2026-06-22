import { redirect } from "next/navigation";

/** Merged into /conferences (Phase 3 hub consolidation) */
export default function EventsRedirectPage() {
  redirect("/conferences");
}
