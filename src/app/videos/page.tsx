"use client";

import React, { Suspense } from "react";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { PAGE_HEROES } from "@/lib/page-heroes";

const VideoPage = React.lazy(() => import("@/components/content/VideoPage"));

export default function VideosRoutePage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.videos} skipContainer>
      <Suspense fallback={<div className="py-12 text-center text-slate-600">Loading videos…</div>}>
        <VideoPage />
      </Suspense>
    </PublicPageShell>
  );
}
