import { createPillarMetadata } from "@/lib/knowledge-graph/create-pillar-page";
import ConferenceAuthorityHub from "@/components/knowledge-graph/ConferenceAuthorityHub";

export const metadata = createPillarMetadata("conferences");

export default function ConferencesPage() {
  return <ConferenceAuthorityHub />;
}
