import Image from "next/image";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/config/site";
import type { CmsPartnerCard } from "@/lib/cms/types";

const CATEGORY_LABELS: Record<string, string> = {
  academic: "Academic Partners",
  media: "Media Partners",
  sponsor: "Sponsors",
  government: "Government & Institutions",
  industry: "Industry Partners",
  other: "Partners",
};

export default function PartnersHub({ partners = [] }: { partners?: CmsPartnerCard[] }) {
  const grouped = partners.reduce<Record<string, CmsPartnerCard[]>>((acc, partner) => {
    const key = partner.partnerCategory ?? "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(partner);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  const organizationListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Shiksha Mahakumbh Partners",
    itemListElement: partners.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Organization",
        name: p.name,
        url: p.website ?? `${SITE_URL}/partners`,
        logo: p.logoUrl ?? undefined,
        description: p.description ?? undefined,
      },
    })),
  };

  return (
    <>
      {partners.length > 0 && <JsonLd data={organizationListJsonLd} />}
      {categories.length === 0 ? (
        <p className="text-center text-slate-600">
          Partner listings will appear here once published from the CMS.
        </p>
      ) : (
        categories.map((category) => (
          <section key={category} className="mb-12" aria-labelledby={`partners-${category}`}>
            <h2 id={`partners-${category}`} className="mb-6 text-xl font-bold text-brand-navy">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {grouped[category].map((partner) => (
                <article
                  key={partner.id}
                  className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
                >
                  {partner.logoUrl ? (
                    <div className="relative mb-3 h-20 w-full">
                      <Image
                        src={partner.logoUrl}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain"
                        sizes="160px"
                      />
                    </div>
                  ) : (
                    <div className="mb-3 flex h-20 w-full items-center justify-center rounded-lg bg-brand-surface-warm text-2xl font-bold text-brand-navy/30">
                      {partner.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-brand-navy">{partner.name}</h3>
                  {partner.description && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-3">
                      {partner.description}
                    </p>
                  )}
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-xs font-semibold text-primary hover:underline"
                    >
                      Visit website
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
