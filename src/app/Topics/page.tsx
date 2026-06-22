import { redirect } from "next/navigation";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";

/** Legacy call-for-papers topics list → Microsoft CMT submission (Phase 5) */
export default function TopicsRedirectPage() {
  redirect(CMT_SUBMISSION_URL);
}
