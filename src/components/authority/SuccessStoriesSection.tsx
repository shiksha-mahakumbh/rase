import { successStories } from "@/data/authority";
import { SectionHeader } from "@/components/ui";

interface Props {
  className?: string;
}

export default function SuccessStoriesSection({ className = "" }: Props) {
  return (
    <section aria-label="Success stories" className={`py-12 md:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Outcomes"
          title="Success Stories"
          description="Voices from schools, universities, and student achievers."
          align="center"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {successStories.map((story) => (
            <blockquote
              key={story.author}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-slate-700 leading-relaxed">&ldquo;{story.quote}&rdquo;</p>
              <footer className="mt-4 border-t border-slate-100 pt-4">
                <cite className="not-italic font-semibold text-brand-navy">
                  {story.author}
                </cite>
                <p className="text-sm text-slate-500">
                  {story.role}
                  {story.edition ? ` · ${story.edition}` : ""}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
