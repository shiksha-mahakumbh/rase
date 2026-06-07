import { SectionHeader } from "@/components/ui";
import { event } from "@/design/tokens";

const travel = [
  { title: "Venue", items: [event.venue, event.location] },
  {
    title: "Nearest Airport",
    items: ["Gaggal Airport (Dharamshala) ~85 km", "Chandigarh Airport ~180 km"],
  },
  {
    title: "Railway",
    items: ["Una Himachal ~80 km", "Amb Andaura ~60 km"],
  },
  {
    title: "Stay",
    items: ["Request accommodation via registration", "Hotels in Hamirpur & nearby towns"],
  },
];

export default function VenueTravelSection() {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Plan Your Visit"
          title="Venue & Travel"
          description={`${event.name} · 9–11 October 2026 at ${event.venue}.`}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {travel.map((block) => (
              <div
                key={block.title}
                className="rounded-2xl border border-slate-200 bg-brand-surface p-5"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-saffron">
                  {block.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="text-sm text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <iframe
            title="NIT Hamirpur location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26913.5!2d76.5274!3d31.7089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zTklUIEhhbWlycHVy!5e0!3m2!1sen!2sin!4v1"
            className="min-h-[280px] w-full rounded-2xl border border-slate-200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
