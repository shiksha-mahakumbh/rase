import { redirect } from "next/navigation";

/** Legacy /videos route — merged into /gallery */
export default function VideosRedirectPage() {
  redirect("/gallery?tab=videos");
}
