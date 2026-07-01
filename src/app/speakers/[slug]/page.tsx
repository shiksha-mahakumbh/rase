import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsSpeakerView from "@/components/speakers/CmsSpeakerView";
import { loadCmsSpeakerBySlug } from "@/lib/cms/organizational";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const speaker = await loadCmsSpeakerBySlug(slug);

  if (!speaker) notFound();

  const description =
    speaker.bio?.replace(/<[^>]+>/g, "").slice(0, 160) ??
    [speaker.designation, speaker.institution].filter(Boolean).join(" — ") ??
    speaker.fullName;

  return metadataFromCmsSeo(speaker.seo, {
    title: speaker.fullName,
    description,
    path: `/speakers/${slug}`,
    ogImageUrl: speaker.photoUrl ?? speaker.seo?.ogImageUrl,
  });
}

export default async function SpeakerSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const speaker = await loadCmsSpeakerBySlug(slug);
  if (!speaker) notFound();

  return <CmsSpeakerView speaker={speaker} />;
}
