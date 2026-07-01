import { NO_INDEX_META } from "@/lib/seo/publicPages";
import CmsAdminLayoutClient from "./CmsLayoutClient";

export const metadata = {
  ...NO_INDEX_META.admin,
  title: "CMS Admin",
};

export default function CmsAdminLayout({ children }: { children: React.ReactNode }) {
  return <CmsAdminLayoutClient>{children}</CmsAdminLayoutClient>;
}
