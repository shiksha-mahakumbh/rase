import PastEditionPage from "@/components/past-editions/editions/PastEditionPage";
import { SMK_5_0_CONTENT, SMK_5_0_PATH } from "@/data/editions/shiksha-mahakumbh-5.0-hub";

export default function Page() {
  return <PastEditionPage path={SMK_5_0_PATH} content={SMK_5_0_CONTENT} />;
}
