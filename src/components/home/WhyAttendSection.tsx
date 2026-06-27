import { FeatureCard, SectionHeader } from "@/components/ui";
import type { WhyAttendContent } from "@/lib/home/build-home-sections";
import { iconForWhyAttend } from "./why-attend-icons";

export default function WhyAttendSection({ content }: { content: WhyAttendContent }) {
  const { eyebrow, title, description, features } = content;

  return (
    <section
      id="why-attend"
      aria-label="Why attend Shiksha Mahakumbh"
      className="bg-white py-12 md:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard
              key={f.title}
              title={f.title}
              description={f.description}
              badge={f.badge}
              href={f.href}
              icon={iconForWhyAttend(f.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
