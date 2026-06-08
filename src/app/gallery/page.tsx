"use client";

import React, { Suspense } from "react";
import PublicPageShell from "@/components/layouts/PublicPageShell";
import { PAGE_HEROES } from "@/lib/page-heroes";

const GalleryPage = React.lazy(() => import("../component/GalleryPage"));

export default function GalleryRoutePage() {
  return (
    <PublicPageShell hero={PAGE_HEROES.gallery} skipContainer>
      <Suspense fallback={<div className="py-12 text-center text-slate-600">Loading gallery…</div>}>
        <GalleryPage />
      </Suspense>
    </PublicPageShell>
  );
}
