import { CmsProvider } from "@/lib/cms/context";
import { loadPublicChromeCms } from "@/lib/cms/server";
import { DynamicFooter } from "@/components/layout/SiteDynamicChrome";

/** Server-loaded CMS footer — no client-side CMS fetch. */
export async function ServerFooterWithCms() {
  const cms = await loadPublicChromeCms("en");
  return (
    <CmsProvider data={cms}>
      <DynamicFooter />
    </CmsProvider>
  );
}
