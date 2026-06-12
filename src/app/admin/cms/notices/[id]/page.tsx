"use client";

import { use } from "react";
import NoticeEditor from "@/components/admin/cms/NoticeEditor";

export default function EditNoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <NoticeEditor noticeId={id} />;
}
