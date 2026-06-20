import EditionDetailTemplate from "@/components/past-editions/EditionDetailTemplate";
import { PAST_EDITION_BY_ID } from "@/data/past-editions";

const edition = PAST_EDITION_BY_ID["smk-5"];

export default function SM25() {
  return <EditionDetailTemplate edition={edition} />;
}
