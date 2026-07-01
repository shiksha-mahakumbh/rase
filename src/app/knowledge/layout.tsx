import { createRedirectShellMetadata } from "@/lib/seo/metadataBuilders";

export const metadata = createRedirectShellMetadata({
  title: "Knowledge Hub",
  path: "/knowledge",
});

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
