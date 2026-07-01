import { createRedirectShellMetadata } from "@/lib/seo/metadataBuilders";

export const metadata = createRedirectShellMetadata({
  title: "DHE Initiatives — National Education Programmes",
  path: "/initiatives",
});

export default function InitiativesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
