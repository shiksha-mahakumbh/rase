import { redirect } from "next/navigation";

/** Legacy static keynote list → full speaker directory (Phase 5) */
export default function KeynoteSpeakersRedirectPage() {
  redirect("/speakers/directory");
}
