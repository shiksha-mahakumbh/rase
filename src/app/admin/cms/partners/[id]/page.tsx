"use client";

import { use } from "react";
import PartnerEditor from "@/components/admin/cms/PartnerEditor";

export default function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <PartnerEditor partnerId={id} />;
}
