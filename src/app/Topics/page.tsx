import { redirect } from "next/navigation";
import { CMT_SUBMIT_PATH } from "@/lib/registration/config";

/** Legacy call-for-papers topics list → CMT interstitial (Phase 5) */
export default function TopicsRedirectPage() {
  redirect(CMT_SUBMIT_PATH);
}
