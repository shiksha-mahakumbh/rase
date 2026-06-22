import { redirect } from "next/navigation";
import { DHE_JOURNALS_URL } from "@/lib/knowledge-graph/site-cleanup";

/** Legacy /journals route — canonical journal platform is pub.dhe.org.in */
export default function JournalsRedirectPage() {
  redirect(DHE_JOURNALS_URL);
}
