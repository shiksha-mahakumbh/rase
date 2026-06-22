import EducationHubPage from "@/components/knowledge-graph/EducationHubPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Programmes & Resources — Shiksha Mahakumbh Abhiyan",
  description:
    "Registration, national editions, workshops, publications, gallery, and media — practical entry points for Shiksha Mahakumbh Abhiyan.",
  path: "/education",
  keywords: [
    "Shiksha Mahakumbh programmes",
    "registration SMK 6.0",
    "past editions",
    "workshops",
    "publications",
  ],
});

export default function EducationPage() {
  return <EducationHubPage />;
}
