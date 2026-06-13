import { redirect } from "next/navigation";
import { CMT_SUBMISSION_URL } from "@/lib/registration/config";

/** Legacy route — consolidated into Multi Track Conference (CMT) */
export default function FullLengthPaperPage() {
  redirect(CMT_SUBMISSION_URL);
}
