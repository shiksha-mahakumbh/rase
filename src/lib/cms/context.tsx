"use client";

import { createContext, useContext } from "react";
import type { CmsPageData } from "./types";

const CmsContext = createContext<CmsPageData | null>(null);

export function CmsProvider({
  data,
  children,
}: {
  data: CmsPageData;
  children: React.ReactNode;
}) {
  return <CmsContext.Provider value={data}>{children}</CmsContext.Provider>;
}

export function useCms(): CmsPageData | null {
  return useContext(CmsContext);
}
