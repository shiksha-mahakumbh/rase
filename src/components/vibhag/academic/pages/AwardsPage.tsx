"use client";

import {
  ACPage,
  ACHero,
  ACSection,
  ACCard,
  ACGlassPanel,
  ACTimelineStep,
  ACHighlightPanel,
  SectionCTA,
  ACFooterStatement,
  REG_LINKS,
} from "../AcademicCouncilUI";
import { awardCategories } from "../academic-content-data";

export default function AwardsPage() {
  return (
    <ACPage>
      <ACHero
        title="🏆 Excellence Awards – Shiksha Mahakumbh 6.0"
        subtitle={
          <p className="max-w-5xl mx-auto">
            Celebrating outstanding contributions in research,
            innovation, publications, entrepreneurship, and
            academic excellence.
          </p>
        }
      />

      <ACSection title="🌟 Overview">
        <ACGlassPanel>
          <p className="text-lg leading-8 text-gray-700">
            The Excellence Awards at Shiksha Mahakumbh 6.0 aim
            to recognize and celebrate outstanding contributions
            in the fields of research, innovation, publications,
            and entrepreneurship. These awards honour both
            faculty members and students who have demonstrated
            excellence and impact in their respective domains.
          </p>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="🎯 Award Categories">
        <div className="grid gap-6 md:grid-cols-2">
          <ACCard className="border-l-4 border-l-brand-saffron">
            <h3 className="mb-4 text-2xl font-bold">
              👨‍🏫 Faculty Excellence Award
            </h3>
            <p className="leading-7 text-gray-700">
              Recognizing outstanding academic and research
              contributions by faculty members.
            </p>
          </ACCard>
          <ACCard className="border-l-4 border-l-amber-400">
            <h3 className="mb-4 text-2xl font-bold">
              🎓 Student Excellence Award
            </h3>
            <p className="leading-7 text-gray-700">
              Honouring talented students for innovation,
              research, and creative achievements.
            </p>
          </ACCard>
        </div>
      </ACSection>

      <ACSection title="🏫 Levels of Awards">
        <div className="grid gap-6 md:grid-cols-2">
          <ACCard className="text-center">
            <h3 className="text-2xl font-bold">🏫 School Level</h3>
          </ACCard>
          <ACCard className="text-center">
            <h3 className="text-2xl font-bold">
              🎓 College / University Level
            </h3>
          </ACCard>
        </div>
      </ACSection>

      <ACSection title="📂 Evaluation Categories">
        <div className="space-y-6">
          {awardCategories.map((category, index) => (
            <ACCard key={index} hover={false}>
              <h3 className="mb-5 text-2xl font-bold text-brand-saffron-dark">
                {index + 1}. {category.title}
              </h3>
              <ul className="list-disc space-y-2 pl-6 text-gray-700">
                {category.details.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </ACCard>
          ))}
        </div>
      </ACSection>

      <ACSection title="📋 Document Checklist">
        <ACGlassPanel>
          <div className="grid gap-4 text-gray-700 md:grid-cols-2">
            <div className="rounded-xl bg-slate-100 p-4">
              Proof of publication (first page / DOI link)
            </div>
            <div className="rounded-xl bg-slate-100 p-4">
              ISBN / Patent certificate copies
            </div>
            <div className="rounded-xl bg-slate-100 p-4">
              Grant approval letters
            </div>
            <div className="rounded-xl bg-slate-100 p-4">
              Startup registration proof (if applicable)
            </div>
            <div className="rounded-xl bg-slate-100 p-4 md:col-span-2">
              Any other supporting documents
            </div>
          </div>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="⚙️ Selection Process">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            "Application Submission",
            "Document Verification",
            "Expert Review Committee Evaluation",
            "Final Selection",
            "Award Declaration",
          ].map((step, index) => (
            <ACTimelineStep key={index} step={index + 1}>
              {step}
            </ACTimelineStep>
          ))}
        </div>
      </ACSection>

      <section className="px-4 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-5xl">
        <ACHighlightPanel title="🏅 Recognition & Benefits">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "🏆 Trophy & Certificate of Excellence",
              "🌟 National Recognition",
              "📢 Opportunity to present work",
              "🤝 Networking with academicians & industry leaders",
            ].map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/20 p-5 text-center"
              >
                <p className="font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </ACHighlightPanel>
        </div>
      </section>

      <ACSection title="📅 Important Timeline">
        <ACGlassPanel>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-100 p-5">
              📌 Call for Applications: To be announced
            </div>
            <div className="rounded-xl bg-slate-100 p-5">
              📌 Last Date: To be announced
            </div>
            <div className="rounded-xl bg-slate-100 p-5">
              📌 Result Declaration: During Shiksha Mahakumbh 2026
            </div>
          </div>
        </ACGlassPanel>
      </ACSection>

      <ACSection title="📞 Contact">
        <ACGlassPanel>
          <div className="space-y-3 text-lg text-gray-700">
            <p>📧 academics@shikshamahakumbh.com</p>
            <p>📞 +91-7903431900</p>
            <p>🌐 www.shikshamahakumbh.com</p>
          </div>
        </ACGlassPanel>
      </ACSection>

      <ACFooterStatement title="✨ Celebrating Excellence, Inspiring Innovation">
        These awards aim to encourage a culture of research, creativity, and
        impactful contribution in education and society.
      </ACFooterStatement>

      <SectionCTA buttonText="नामांकन करें" href={REG_LINKS.general} />
    </ACPage>
  );
}
