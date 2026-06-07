import { FeatureCard, SectionHeader } from "@/components/ui";

const audiences = [
  { title: "Educators & Faculty", description: "Schools, colleges, universities, and teacher training institutions." },
  { title: "Researchers & Scholars", description: "Abstract and full-paper presenters across education and IKS domains." },
  { title: "Students & Youth", description: "Olympiads, talent conclaves, cultural programmes, and innovation projects." },
  { title: "Institutions & INIs", description: "IITs, NITs, central universities, and research organisations." },
  { title: "NGOs & Civil Society", description: "Grassroots education initiatives and community-led programmes." },
  { title: "Industry & Startups", description: "EdTech, innovation exhibits, and industry-academia collaboration." },
];

function UserIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export default function WhoShouldAttendSection() {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Audience"
          title="Who Should Join"
          description="If you shape education, research, or youth development in Bharat — this platform is for you."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a) => (
            <FeatureCard
              key={a.title}
              title={a.title}
              description={a.description}
              icon={<UserIcon />}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
