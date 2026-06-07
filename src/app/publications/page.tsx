import { createPillarMetadata } from "@/lib/knowledge-graph/create-pillar-page";
import PublicationAuthorityHub from "@/components/knowledge-graph/PublicationAuthorityHub";

export const metadata = createPillarMetadata("publications");

export default function PublicationsPage() {
  return <PublicationAuthorityHub />;
}
