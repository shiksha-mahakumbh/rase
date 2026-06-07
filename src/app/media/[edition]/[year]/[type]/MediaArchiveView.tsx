"use client";

import React from "react";
import CompanyInfo from "@/app/component/CompanyInfo";
import NavBar from "@/app/component/NavBar";
import Footer from "@/app/component/Footer";
import {
  getMediaArchiveComponent,
  type MediaArchiveKey,
} from "@/data/media-archive-components";

export default function MediaArchiveView({ archiveKey }: { archiveKey: MediaArchiveKey }) {
  const Archive = getMediaArchiveComponent(archiveKey);

  return (
    <div className="bg-white">
      <CompanyInfo />
      <NavBar />
      <React.Suspense fallback={<div className="p-8 text-center">Loading archive…</div>}>
        <Archive />
      </React.Suspense>
      <Footer />
    </div>
  );
}
