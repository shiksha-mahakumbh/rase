import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Knowledge Hub",
  description:
    "Articles, research, policy updates, news, and event reports from Shiksha Mahakumbh Abhiyan.",
  path: "/knowledge",
  keywords: ["education research", "policy", "NEP", "Shiksha Mahakumbh publications"],
});

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
