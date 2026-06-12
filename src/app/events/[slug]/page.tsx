import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsEventView from "@/components/events/CmsEventView";
import { loadCmsEventBySlug } from "@/lib/cms/organizational";
import { metadataFromCmsSeo } from "@/lib/seo/cms-metadata";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await loadCmsEventBySlug(slug);

  if (!event) return { title: "Event" };

  return metadataFromCmsSeo(event.seo, {
    title: event.title,
    description: event.description ?? event.title,
    path: `/events/${slug}`,
    ogImageUrl: event.bannerUrl ?? event.seo?.ogImageUrl,
  });
}

export default async function EventSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await loadCmsEventBySlug(slug);
  if (!event) notFound();

  return <CmsEventView event={event} />;
}
