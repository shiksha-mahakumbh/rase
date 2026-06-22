import PastEditionPage from "@/components/past-editions/editions/PastEditionPage";
import { SMK_3_0_CONTENT, SMK_3_0_PATH } from "@/data/editions/shiksha-mahakumbh-3.0-hub";

export default function Page() {
  return <PastEditionPage path={SMK_3_0_PATH} content={SMK_3_0_CONTENT} />;
}
