"use client";

import { use } from "react";
import SpeakerEditor from "@/components/admin/cms/SpeakerEditor";

export default function EditSpeakerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <SpeakerEditor speakerId={id} />;
}
