"use client";

import { use } from "react";
import CommitteeEditor from "@/components/admin/cms/CommitteeEditor";

export default function EditCommitteePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <CommitteeEditor committeeId={id} />;
}
