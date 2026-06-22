import PastEditionPage from "@/components/past-editions/editions/PastEditionPage";
import { SMK_4_0_CONTENT, SMK_4_0_PATH } from "@/data/editions/shiksha-mahakumbh-4.0-hub";

export default function Page() {
  return <PastEditionPage path={SMK_4_0_PATH} content={SMK_4_0_CONTENT} />;
}
