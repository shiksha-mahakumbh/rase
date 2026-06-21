import CommitteeEditionPage from "@/components/committee/CommitteeEditionPage";
import CommitteeEditionContent from "@/components/committee/CommitteeEditionContent";
import CommitteeEditionHeader from "@/components/committee/CommitteeEditionHeader";
import CommitteeExportActions from "@/components/committee/CommitteeExportActions";
import type { CommitteeEditionData } from "@/data/committee-members";

interface CommitteeLegacyEditionViewProps {
  edition: CommitteeEditionData;
}

export default function CommitteeLegacyEditionView({ edition }: CommitteeLegacyEditionViewProps) {
  return (
    <CommitteeEditionPage editionTitle={edition.pageTitle} edition={edition}>
      <div className="committee-print-root">
        <CommitteeEditionHeader edition={edition} />
        <div className="mt-6">
          <CommitteeExportActions edition={edition} />
        </div>
        <div className="committee-print-content mt-8">
          <CommitteeEditionContent edition={edition} />
        </div>
      </div>
    </CommitteeEditionPage>
  );
}
