import { createPillarMetadata } from "@/lib/knowledge-graph/create-pillar-page";
import ConferenceAuthorityHub from "@/components/knowledge-graph/ConferenceAuthorityHub";
import { loadCmsEvents } from "@/lib/cms/organizational";

export const metadata = createPillarMetadata("conferences");

export default async function ConferencesPage() {
  const cmsEvents = await loadCmsEvents();
  return <ConferenceAuthorityHub cmsEvents={cmsEvents} />;
}
