import JsonLd from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { ABIYAN_PHOTO_FRAME } from "@/data/abhiyan-photo-frame";

export default function AbhiyanPhotoFrameJsonLd() {
  const url = `${SITE_URL}${ABIYAN_PHOTO_FRAME.pagePath}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Shiksha Mahakumbh Abhiyan Photo Frame",
        description:
          "Official photo frame of Shiksha Mahakumbh Abhiyan — leadership, advisors, edition dignitaries, invitation campaign, and coordinators across editions 1.0–5.0.",
        url,
        inLanguage: ["en-IN", "hi-IN"],
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
        },
        about: {
          "@type": "EducationalOrganization",
          name: "Department of Holistic Education",
          alternateName: "Shiksha Mahakumbh Abhiyan",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/branding/shiksha-mahakumbh-brand-hero.png`,
        },
        significantLink: ABIYAN_PHOTO_FRAME.pdfUrl,
      }}
    />
  );
}
