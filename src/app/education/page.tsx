import EducationHubPage from "@/components/knowledge-graph/EducationHubPage";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Education Ecosystem — Shiksha Mahakumbh Abhiyan",
  description:
    "Explore the national education ecosystem: school and higher education, research, innovation, policy, olympiads, awards, conferences, publications, and media.",
  path: "/education",
  keywords: [
    "education ecosystem India",
    "Shiksha Mahakumbh pillars",
    "NEP 2020 programmes",
  ],
});

export default function EducationPage() {
  return <EducationHubPage />;
}
