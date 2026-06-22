import { redirect } from "next/navigation";

/** Legacy talk-show page → media centre (Phase 5) */
export default function TalkShowRedirectPage() {
  redirect("/media-center");
}
