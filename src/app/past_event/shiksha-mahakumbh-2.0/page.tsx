import PastEditionPage from "@/components/past-editions/editions/PastEditionPage";
import { SMK_2_0_CONTENT, SMK_2_0_PATH } from "@/data/editions/shiksha-mahakumbh-2.0-hub";

export default function Page() {
  return <PastEditionPage path={SMK_2_0_PATH} content={SMK_2_0_CONTENT} />;
}
