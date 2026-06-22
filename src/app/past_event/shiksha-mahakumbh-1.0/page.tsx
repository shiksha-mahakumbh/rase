import PastEditionPage from "@/components/past-editions/editions/PastEditionPage";
import { SMK_1_0_CONTENT, SMK_1_0_PATH } from "@/data/editions/shiksha-mahakumbh-1.0-hub";

export default function Page() {
  return <PastEditionPage path={SMK_1_0_PATH} content={SMK_1_0_CONTENT} />;
}
