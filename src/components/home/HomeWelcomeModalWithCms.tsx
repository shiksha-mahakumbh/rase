"use client";

import type { CmsPageData } from "@/lib/cms/types";
import { CmsProvider } from "@/lib/cms/context";
import HomeWelcomeModalDeferred from "./HomeWelcomeModalDeferred";

export default function HomeWelcomeModalWithCms({ cmsData }: { cmsData: CmsPageData }) {
  return (
    <CmsProvider data={cmsData}>
      <HomeWelcomeModalDeferred />
    </CmsProvider>
  );
}
