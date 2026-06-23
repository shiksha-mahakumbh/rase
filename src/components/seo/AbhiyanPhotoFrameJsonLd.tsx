import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import {
  ABIYAN_PHOTO_FRAME,
  EDITION_CHIEF_GUESTS,
  INVITATION_CAMPAIGN_GROUPS,
  getInvitationGroupItems,
} from "@/data/abhiyan-photo-frame";
import {
  PHOTO_FRAME_CANONICAL_URL,
  PHOTO_FRAME_HERO_IMAGE,
  PHOTO_FRAME_PAGE_HERO,
} from "@/data/abhiyan-photo-frame-hub";
import { PAST_EDITIONS } from "@/data/past-editions";
import {
  buildCollectionPageSchema,
  buildItemListSchema,
  orgReference,
} from "@/lib/seo/schema";

export default function AbhiyanPhotoFrameJsonLd() {
  const collection = buildCollectionPageSchema({
    name: PHOTO_FRAME_PAGE_HERO.title,
    description: PHOTO_FRAME_PAGE_HERO.subtitle,
    path: ABIYAN_PHOTO_FRAME.pagePath,
  });

  const editionsList = buildItemListSchema({
    name: "Shiksha Mahakumbh editions in photo frame",
    items: PAST_EDITIONS.map((e) => ({
      name: e.title,
      url: `${SITE_URL}${e.href}`,
    })),
  });

  const chiefGuestsList = buildItemListSchema({
    name: "Chief guests by edition",
    items: PAST_EDITIONS.flatMap((e) =>
      (EDITION_CHIEF_GUESTS[e.edition] ?? []).map((guest) => ({
        name: `${guest.name} (${e.title})`,
        url: `${PHOTO_FRAME_CANONICAL_URL}#chief-guests`,
      }))
    ),
  });

  const coordinatorsList = buildItemListSchema({
    name: "Shiksha Mahakumbh Abhiyan coordinators",
    items: ABIYAN_PHOTO_FRAME.coordinators.map((c) => ({
      name: c.name,
      url: `${PHOTO_FRAME_CANONICAL_URL}#coordinators`,
    })),
  });

  const invitationList = buildItemListSchema({
    name: "Invitation campaign dignitaries",
    items: INVITATION_CAMPAIGN_GROUPS.flatMap((group) =>
      getInvitationGroupItems(group.items).map((person) => ({
        name: person.name,
        url: `${PHOTO_FRAME_CANONICAL_URL}#invitation`,
      }))
    ),
  });

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shiksha Mahakumbh Abhiyan Photo Frame",
    description:
      "Official photo frame of Shiksha Mahakumbh Abhiyan — leadership, advisors, edition dignitaries, invitation campaign, and coordinators across editions 1.0–5.0.",
    url: PHOTO_FRAME_CANONICAL_URL,
    inLanguage: ["en-IN", "hi-IN"],
    primaryImageOfPage: `${SITE_URL}${PHOTO_FRAME_HERO_IMAGE}`,
    isPartOf: orgReference(),
    significantLink: ABIYAN_PHOTO_FRAME.pdfUrl,
  };

  return (
    <>
      <JsonLd data={collection} />
      <JsonLd data={editionsList} />
      <JsonLd data={chiefGuestsList} />
      <JsonLd data={coordinatorsList} />
      <JsonLd data={invitationList} />
      <JsonLd data={webPage} />
    </>
  );
}
