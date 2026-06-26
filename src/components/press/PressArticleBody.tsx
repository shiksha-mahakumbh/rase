import Image from "next/image";
import type { PressArticleSection } from "@/lib/press/articles";
import SafeHtml from "@/components/common/SafeHtml";

export default function PressArticleBody({
  title,
  heroImage,
  sections,
}: {
  title: string;
  heroImage?: string;
  sections: PressArticleSection[];
}) {
  return (
    <div className="proceeding-container">
      {heroImage ? (
        <div className="mb-8 flex justify-center">
          <Image
            src={heroImage}
            alt={title}
            width={800}
            height={400}
            className="rounded-lg shadow-md h-auto w-full max-w-3xl object-cover"
          />
        </div>
      ) : null}

      {sections.map((section, index) => (
        <section key={`${section.title}-${index}`} className="mb-8">
          {section.title ? (
            <h3 className="mb-4 text-2xl font-semibold text-brand-navy">{section.title}</h3>
          ) : null}
          {section.body ? (
            <SafeHtml
              html={section.body}
              className="prose prose-slate max-w-none text-gray-700 prose-a:text-brand-saffron"
            />
          ) : null}
        </section>
      ))}
    </div>
  );
}
